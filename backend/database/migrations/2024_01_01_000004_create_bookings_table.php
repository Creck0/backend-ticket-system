<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique(); // kode acak, bukan ID berurutan (cegah IDOR tebak-tebakan)
            $table->foreignId('user_id')->constrained();
            $table->foreignId('destination_id')->constrained();
            $table->date('visit_date');
            $table->decimal('total_amount', 12, 2);
            $table->enum('status', ['pending', 'paid', 'cancelled', 'used', 'expired'])->default('pending');
            $table->timestamp('expires_at')->nullable(); // reservasi hangus jika tidak dibayar
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
