<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['booking_id', 'provider', 'provider_ref', 'amount', 'status', 'raw_payload'];

    protected function casts(): array
    {
        return ['raw_payload' => 'array'];
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
