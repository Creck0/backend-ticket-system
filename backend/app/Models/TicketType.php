<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketType extends Model
{
    protected $fillable = ['destination_id', 'name', 'price', 'stock'];

    protected function casts(): array
    {
        return ['price' => 'decimal:2'];
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
