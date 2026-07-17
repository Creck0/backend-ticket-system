<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('provider'); // midtrans / xendit / dll
            $table->string('provider_ref')->nullable()->index();
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
            $table->json('raw_payload')->nullable(); // simpan payload webhook untuk audit
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
