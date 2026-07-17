<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDestinationRequest;
use App\Models\Destination;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    // Publik: hanya destinasi aktif yang tampil, gunakan pagination (cegah data dumping / DoS berat query)
    public function index()
    {
        $destinations = Destination::query()
            ->where('is_active', true)
            ->with('ticketTypes:id,destination_id,name,price')
            ->select(['id', 'slug', 'name', 'location', 'description', 'image_path'])
            ->paginate(12);

        return response()->json($destinations);
    }

    public function show(Destination $destination)
    {
        // route model binding via slug (getRouteKeyName) - hindari IDOR lewat tebak ID numerik
        if (! $destination->is_active) {
            abort(404);
        }

        return response()->json(
            $destination->load('ticketTypes:id,destination_id,name,price,stock')
        );
    }

    // Middleware 'auth:sanctum' + 'can:admin' diterapkan di routes/api.php
    public function store(StoreDestinationRequest $request)
    {
        $path = null;

        if ($request->hasFile('image')) {
            // simpan dengan nama acak, di luar public root langsung, serve lewat storage:link terkontrol
            $path = $request->file('image')->store('destinations', 'public');
        }

        $destination = Destination::create([
            'slug' => Str::slug($request->name).'-'.Str::random(6),
            'name' => $request->name,
            'location' => $request->location,
            'description' => strip_tags($request->description), // A03: sanitasi dasar sebelum simpan
            'image_path' => $path,
            'quota_per_day' => $request->quota_per_day,
            'is_active' => true,
            'created_by' => $request->user()->id,
        ]);

        foreach ($request->ticket_types as $tt) {
            $destination->ticketTypes()->create([
                'name' => $tt['name'],
                'price' => $tt['price'],
                'stock' => $tt['stock'],
            ]);
        }

        return response()->json($destination->load('ticketTypes'), 201);
    }
}
