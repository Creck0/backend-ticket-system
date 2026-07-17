import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lagoon-950 text-sand px-6 text-center">
      <h1 className="font-display text-6xl mb-4">404</h1>
      <p className="text-lagoon-300 mb-6">Halaman yang kamu cari tidak ditemukan.</p>
      <Link to="/" className="rounded-full bg-dusk-500 text-lagoon-950 font-semibold px-6 py-2.5">
        Kembali ke Beranda
      </Link>
    </div>
  )
}
