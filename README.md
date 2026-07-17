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

Verify everything registered correctly:
```bash
php artisan route:list --path=api
php artisan migrate:status
```

### Start the backend

```bash
php artisan serve
```

Keep this terminal open — closing it stops the server.

### Start the frontend

In a **separate terminal**:

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:8000
npm run dev
```

Open `http://localhost:5173`.


## ⚠️ Before going to production

1. Rotate `APP_KEY` and all `.env` credentials — never commit a real `.env` file.
2. Enforce HTTPS everywhere (HSTS is already wired in).
3. Integrate a real payment gateway (Midtrans/Xendit) with webhook signature verification.
4. Run `php artisan queue:work` to auto-expire unpaid bookings past `expires_at`.
5. Run `composer audit`, `npm audit`, and ideally an automated scan (OWASP ZAP, Dependabot) before release.
