<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ticket_type_id')->constrained();
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 12, 2); // snapshot harga saat transaksi (harga tidak boleh diambil dari input client)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_items');
    }
};
