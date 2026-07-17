<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    // OWASP A08 Software & Data Integrity Failures / Mass Assignment protection:
    // hanya field ini yang boleh diisi lewat request. "role" SENGAJA tidak dimasukkan
    // di sini untuk endpoint publik — perubahan role hanya lewat controller admin khusus.
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];

    // OWASP A02 Cryptographic Failures - jangan pernah expose password/token di response JSON
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'locked_until' => 'datetime',
            'password' => 'hashed', // Laravel otomatis bcrypt saat set
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
