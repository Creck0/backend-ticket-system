# Jelajah Nusa — Sistem Ticketing Wisata

Full-stack scaffold: **React + Tailwind** (frontend) dan **Laravel API** (backend),
dirancang mengikuti mitigasi **OWASP Top 10 (2021)**.

## Struktur folder

```
tourism-ticketing/
├── backend/     # Laravel 11 API
└── frontend/    # React + Vite + Tailwind SPA
```

## Menjalankan Backend (Laravel)

Folder `backend/` berisi file inti (models, controllers, migrations, routes, config,
middleware) yang perlu ditempel ke project Laravel baru, karena installer Laravel
sendiri butuh dijalankan via Composer (butuh koneksi packagist yang tidak tersedia
di lingkungan pembuatan file ini).

```bash
composer create-project laravel/laravel backend-app
cd backend-app
composer require laravel/sanctum spatie/laravel-permission

# salin isi folder backend/ (app, database, routes, config, bootstrap) ke sini, timpa file yang sama
cp -r ../backend/app/* app/
cp -r ../backend/database/migrations/* database/migrations/
cp ../backend/routes/api.php routes/api.php
cp ../backend/config/cors.php config/cors.php
cp ../backend/bootstrap/app.php bootstrap/app.php
cp ../backend/.env.example .env

php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

Tambahkan role admin manual pertama kali lewat tinker:
```bash
php artisan tinker
>>> $u = App\Models\User::find(1);
>>> $u->role = 'admin';
>>> $u->save();
```

## Menjalankan Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env   # isi VITE_API_URL=http://localhost:8000
npm run dev
```

## Peta Mitigasi OWASP Top 10 (2021)

| # | Risiko | Mitigasi di project ini |
|---|--------|--------------------------|
| A01 | Broken Access Control | Route model binding via slug/booking_code (bukan ID berurutan); pengecekan `user_id` eksplisit di `BookingController@show`; middleware `admin` untuk endpoint admin; frontend `ProtectedRoute` hanya untuk UX, otorisasi asli tetap di server |
| A02 | Cryptographic Failures | Password di-hash bcrypt (`'password' => 'hashed'`), `$hidden` di model User, cookie session `httpOnly` + `Secure` + `SameSite`, HSTS header |
| A03 | Injection | Semua query lewat Eloquent/Query Builder (parameterized), Form Request validation ketat di setiap endpoint, `strip_tags()` untuk input teks bebas, upload file divalidasi MIME asli bukan ekstensi |
| A04 | Insecure Design | Rate limiting berlapis (login 6x/menit, API umum 60x/menit), transaksi DB dengan `lockForUpdate()` untuk cegah race condition overselling tiket, harga & total selalu dihitung ulang di server |
| A05 | Security Misconfiguration | `APP_DEBUG=false` di production, custom exception handler yang tidak membocorkan stack trace, `SecurityHeaders` middleware (CSP, X-Frame-Options, X-Content-Type-Options), CORS whitelist origin (tidak pernah `*`) |
| A06 | Vulnerable & Outdated Components | Gunakan versi Laravel 11 / React 18 / Sanctum terbaru; jalankan `composer audit` & `npm audit` secara rutin |
| A07 | Identification & Auth Failures | Rate limit + lockout brute force login, pesan error generik (anti user-enumeration), `Password::uncompromised()` cek password bocor, session regenerate saat login/logout |
| A08 | Software & Data Integrity Failures | `$fillable` eksplisit di semua model (anti mass-assignment), field `role` sengaja tidak bisa diisi lewat request publik |
| A09 | Security Logging & Monitoring Failures | Tabel `audit_logs` mencatat login sukses/gagal, registrasi, dan bisa diperluas ke aksi booking/admin |
| A10 | Server-Side Request Forgery (SSRF) | Tidak ada fitur fetch URL dari input user; jika ditambahkan integrasi payment gateway via webhook, validasi origin & signature webhook sebelum diproses |

## Catatan penting sebelum production

1. Ganti `APP_KEY` dan semua kredensial `.env` — jangan pernah commit file `.env` asli.
2. Pasang HTTPS wajib (HSTS sudah disiapkan di middleware).
3. Tambahkan integrasi payment gateway (Midtrans/Xendit) dengan verifikasi signature webhook.
4. Aktifkan `php artisan queue:work` untuk job pembatalan booking otomatis saat `expires_at` lewat.
5. Lakukan `composer audit`, `npm audit`, dan idealnya scan otomatis (misalnya OWASP ZAP / Dependabot) sebelum rilis.
