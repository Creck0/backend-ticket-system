<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug', 'name', 'location', 'description', 'image_path',
        'quota_per_day', 'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function ticketTypes()
    {
        return $this->hasMany(TicketType::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // Selalu resolve by slug, bukan ID berurutan, untuk mengurangi enumerasi (OWASP A01)
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
