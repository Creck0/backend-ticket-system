<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Booking extends Model
{
    // Catatan: total_amount TIDAK boleh masuk fillable dari input user mentah;
    // selalu dihitung ulang di server (lihat BookingController) untuk cegah manipulasi harga.
    protected $fillable = [
        'booking_code', 'user_id', 'destination_id', 'visit_date',
        'total_amount', 'status', 'expires_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            $booking->booking_code = $booking->booking_code
                ?: strtoupper(Str::random(10)); // ID publik acak, bukan auto-increment
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function items()
    {
        return $this->hasMany(BookingItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function getRouteKeyName(): string
    {
        return 'booking_code';
    }
}
