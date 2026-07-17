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

**Security (mapped to OWASP Top 10)**
- Server-side price & total recalculation on every booking (client never sends trusted price data)
- Row-level locking (`lockForUpdate`) to prevent stock overselling under concurrent bookings
- Brute-force login protection with rate limiting + generic error messages (anti user-enumeration)
- Mass-assignment protection via explicit `$fillable` on every model
- Security headers middleware (CSP, X-Frame-Options, HSTS, etc.)
- CORS locked to a single allowed frontend origin (never `*`)
- Audit log table for authentication and sensitive actions
- Strict Form Request validation on every endpoint (no raw/unvalidated input touches the DB)

See the [full OWASP Top 10 mapping table](#-owasp-top-10-mitigation-map) below.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS, Vite, Axios |
| Backend | Laravel 11, Laravel Sanctum (SPA cookie auth), Eloquent ORM |
| Database | SQLite (dev default) or MySQL |
| Auth | Session + HttpOnly cookies via Sanctum (no JWT/localStorage tokens) |

## 📁 Project Structure
