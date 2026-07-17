# Jelajah Nusa — Tourism Ticketing System

A full-stack tourism ticket booking platform built with **React + Tailwind CSS** (frontend) and **Laravel API** (backend), designed from the ground up with **OWASP Top 10 (2021)** mitigations baked into the code.

---

## 📋 Description

Jelajah Nusa lets visitors browse tourist destinations, book entry tickets by date and ticket type, and manage their bookings — while admins can add and manage destinations. It's built as a decoupled SPA (React) talking to a stateless-feeling but session-authenticated Laravel API (via Sanctum SPA auth), so the architecture mirrors what you'd use in a real production tourism booking product.

## ✨ Features

**Visitor / Customer**
- Browse active destinations with pagination
- View destination detail with available ticket types & prices
- Register / login (cookie-based session auth, not localStorage tokens)
- Book tickets for a chosen visit date and quantity per ticket type
- View personal booking history with status (pending, paid, cancelled, used, expired)

**Admin**
- Add new destinations with image upload
- Define multiple ticket types (name, price, stock) per destination
- Role-based access enforced server-side (not just hidden in the UI)

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS, Vite, Axios |
| Backend | Laravel 11, Laravel Sanctum (SPA cookie auth), Eloquent ORM |
| Database | SQLite (dev default) or MySQL |
| Auth | Session + HttpOnly cookies via Sanctum (no JWT/localStorage tokens) |

## 📁 Project Structure

```
tourism-ticketing/
├── backend/                          # Laravel core files (drop into a fresh Laravel install)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/      # AuthController, DestinationController, BookingController
│   │   │   ├── Middleware/           # SecurityHeaders, EnsureUserIsAdmin
│   │   │   └── Requests/             # Form Request validation classes
│   │   └── Models/                   # User, Destination, TicketType, Booking, BookingItem, Payment, AuditLog
│   ├── bootstrap/app.php             # Middleware pipeline, routing registration, exception handling
│   ├── config/cors.php               # CORS whitelist config
│   ├── database/migrations/          # All custom migrations
│   ├── public/                       # Standard Laravel entry point (index.php, .htaccess)
│   ├── routes/api.php                # All API routes
│   └── .env.example
│
├── frontend/                         # Complete Vite + React project (ready to run as-is)
│   ├── src/
│   │   ├── api/axios.js              # Axios instance with CSRF/cookie handling
│   │   ├── components/               # Navbar, DestinationCard, ProtectedRoute
│   │   ├── context/AuthContext.jsx   # Auth state provider
│   │   └── pages/                    # Home, Login, Register, DestinationDetail, MyTickets, AdminDestinations
│   ├── tailwind.config.js
│   └── package.json
│
├── SETUP.sh                          # Automated setup script (run on your own machine, not in a sandbox)
└── README.md
```

## 🚀 Setup Instructions

> ⚠️ You need **PHP ≥ 8.2**, **Composer**, and **Node.js** installed locally. These steps must be run on your own machine — the `backend/` folder here only contains custom files layered on top of a real Laravel installation, not a full Laravel skeleton.

### 1. Generate a real Laravel project

```bash
composer create-project laravel/laravel backend-app
cd backend-app
composer require laravel/sanctum spatie/laravel-permission
```

### 2. Copy the custom files into it

```bash
cp -r ../tourism-ticketing/backend/app/. app/
cp -r ../tourism-ticketing/backend/database/migrations/. database/migrations/
cp ../tourism-ticketing/backend/routes/api.php routes/api.php
cp ../tourism-ticketing/backend/config/cors.php config/cors.php
cp ../tourism-ticketing/backend/bootstrap/app.php bootstrap/app.php
cp ../tourism-ticketing/backend/.env.example .env
```

**Remove the default Laravel `users` migration** — it conflicts with the custom one that already includes `phone`, `role`, etc.:
```bash
rm database/migrations/0001_01_01_000000_create_users_table.php
```

**Generate the sessions table migration** (needed because `SESSION_DRIVER=database` is used, and Laravel 11 doesn't include this by default):
```bash
php artisan make:session-table
```

### 3. Configure `.env`

Edit `.env` and make sure these values are set (adjust `APP_KEY` by running `php artisan key:generate` if needed):

```env
DB_CONNECTION=sqlite
SESSION_DRIVER=database
SESSION_DOMAIN=localhost

FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

If using SQLite, create the database file:
```bash
touch database/database.sqlite
```

### 4. Run migrations & finish setup

```bash
php artisan key:generate
php artisan migrate:fresh
php artisan storage:link
```

> Note: `storage:link` creates a symlink and can fail on some filesystems (e.g. Windows/WSL mounted drives). If it errors, either run your project from a native Linux path, or manually copy `public/storage` contents as needed.

Verify everything registered correctly:
```bash
php artisan route:list --path=api
php artisan migrate:status
```

### 5. Start the backend

```bash
php artisan serve
```

Keep this terminal open — closing it stops the server.

### 6. Start the frontend

In a **separate terminal**:

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:8000
npm run dev
```

Open `http://localhost:5173`.

### 7. Create your first admin user

Register a normal account through the UI, then promote it via Tinker:
```bash
php artisan tinker
>>> $u = App\Models\User::first();
>>> $u->role = 'admin';
>>> $u->save();
```

---

## 🔒 OWASP Top 10 Mitigation Map

| # | Risk | Mitigation in this project |
|---|------|------------------------------|
| A01 | Broken Access Control | Route binding via slug/booking_code (not sequential IDs); explicit `user_id` ownership checks in `BookingController@show`; `admin` middleware for admin-only endpoints; frontend `ProtectedRoute` is UX-only, real authorization always re-checked server-side |
| A02 | Cryptographic Failures | Passwords hashed with bcrypt (`'password' => 'hashed'`); `$hidden` on the User model; `httpOnly` + `Secure` + `SameSite` session cookies; HSTS header |
| A03 | Injection | All queries via Eloquent/Query Builder (parameterized); strict Form Request validation on every endpoint; `strip_tags()` on free-text input; file uploads validated by real MIME type, not extension |
| A04 | Insecure Design | Layered rate limiting (login: 6/min, general API: 60/min); DB transactions with `lockForUpdate()` to prevent overselling; price/total always recalculated server-side |
| A05 | Security Misconfiguration | `APP_DEBUG=false` in production; custom exception handler that never leaks stack traces; `SecurityHeaders` middleware (CSP, X-Frame-Options, X-Content-Type-Options); CORS origin whitelist (never `*`) |
| A06 | Vulnerable & Outdated Components | Built on current Laravel 11 / React 18 / Sanctum; run `composer audit` and `npm audit` regularly |
| A07 | Identification & Auth Failures | Brute-force rate limiting + lockout on login; generic error messages (anti user-enumeration); `Password` complexity rules; session regeneration on login/logout |
| A08 | Software & Data Integrity Failures | Explicit `$fillable` on every model (anti mass-assignment); `role` field is never assignable through public request input |
| A09 | Security Logging & Monitoring Failures | `audit_logs` table tracks login success/failure, registration, and is extensible to booking/admin actions |
| A10 | Server-Side Request Forgery (SSRF) | No feature fetches URLs from user input; if a payment gateway webhook is added later, validate origin & signature before processing |

## ⚠️ Before going to production

1. Rotate `APP_KEY` and all `.env` credentials — never commit a real `.env` file.
2. Enforce HTTPS everywhere (HSTS is already wired in).
3. Integrate a real payment gateway (Midtrans/Xendit) with webhook signature verification.
4. Run `php artisan queue:work` to auto-expire unpaid bookings past `expires_at`.
5. Run `composer audit`, `npm audit`, and ideally an automated scan (OWASP ZAP, Dependabot) before release.
