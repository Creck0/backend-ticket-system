<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DestinationController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:6,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{destination}', [DestinationController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/destinations', [DestinationController::class, 'store']);
});
