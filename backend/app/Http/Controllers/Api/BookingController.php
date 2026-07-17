<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Destination;
use App\Models\TicketType;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        // A01 Broken Access Control: user HANYA boleh melihat booking miliknya sendiri
        $bookings = $request->user()
            ->bookings()
            ->with('items.ticketType', 'destination:id,name,slug')
            ->latest()
            ->paginate(10);

        return response()->json($bookings);
    }

    public function show(Booking $booking, \Illuminate\Http\Request $request)
    {
        // Cegah IDOR: pastikan booking ini benar milik user yang login (atau admin)
        if ($booking->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            abort(403, 'Anda tidak berhak mengakses booking ini.');
        }

        return response()->json($booking->load('items.ticketType', 'destination', 'payment'));
    }

    public function store(StoreBookingRequest $request)
    {
        $destination = Destination::where('slug', $request->destination_slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Semua kalkulasi harga & stok dilakukan SERVER-SIDE dalam transaksi terkunci,
        // client tidak pernah bisa mengirim harga sendiri (cegah manipulasi total_amount).
        $booking = DB::transaction(function () use ($request, $destination) {
            $total = 0;
            $itemsToCreate = [];

            foreach ($request->items as $item) {
                // lockForUpdate mencegah race condition overselling saat stok tipis
                $ticketType = TicketType::where('id', $item['ticket_type_id'])
                    ->where('destination_id', $destination->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($ticketType->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Stok tiket '{$ticketType->name}' tidak mencukupi.",
                    ]);
                }

                $ticketType->decrement('stock', $item['quantity']);

                $subtotal = $ticketType->price * $item['quantity'];
                $total += $subtotal;

                $itemsToCreate[] = [
                    'ticket_type_id' => $ticketType->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $ticketType->price,
                ];
            }

            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'destination_id' => $destination->id,
                'visit_date' => $request->visit_date,
                'total_amount' => $total,
                'status' => 'pending',
                'expires_at' => now()->addMinutes(30),
            ]);

            $booking->items()->createMany($itemsToCreate);

            return $booking;
        });

        return response()->json($booking->load('items.ticketType'), 201);
    }
}
