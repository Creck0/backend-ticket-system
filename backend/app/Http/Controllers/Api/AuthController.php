<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // A02: selalu di-hash, tidak pernah disimpan plaintext
            'phone' => $request->phone,
            // 'role' TIDAK diambil dari request -> default 'customer' (A01/A08)
        ]);

        $this->log($user->id, 'register', $request);

        // SPA auth via Sanctum cookie session, bukan menaruh token di localStorage (kurangi risiko XSS-token-theft)
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['user' => $user]);
    }

    public function login(LoginRequest $request)
    {
        $email = $request->email;

        // OWASP A07 Identification & Auth Failures: rate limit brute force per email+IP
        $throttleKey = strtolower($email).'|'.$request->ip();
        $maxAttempts = (int) config('auth.login_max_attempts', 5);

        if (RateLimiter::tooManyAttempts($throttleKey, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $this->log(null, 'login_locked', $request, ['email' => $email]);

            throw ValidationException::withMessages([
                'email' => "Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik.",
            ]);
        }

        if (! Auth::attempt($request->only('email', 'password'), false)) {
            RateLimiter::hit($throttleKey, 60);
            $this->log(null, 'login_failed', $request, ['email' => $email]);

            // Pesan generik: jangan bocorkan apakah email terdaftar atau tidak (cegah user enumeration)
            throw ValidationException::withMessages([
                'email' => 'Email atau password salah.',
            ]);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate(); // cegah session fixation

        $user = Auth::user();
        $this->log($user->id, 'login_success', $request);

        return response()->json(['user' => $user]);
    }

    public function logout(Request $request)
    {
        $userId = Auth::id();
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $this->log($userId, 'logout', $request);

        return response()->json(['message' => 'Berhasil logout.']);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    private function log(?int $userId, string $action, Request $request, array $meta = []): void
    {
        // OWASP A09: catat event autentikasi untuk audit & deteksi anomali
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
            'meta' => $meta,
        ]);
    }
}
