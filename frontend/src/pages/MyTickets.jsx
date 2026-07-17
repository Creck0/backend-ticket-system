import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import api from '../api/axios.js'

const statusLabel = {
  pending: 'Menunggu Pembayaran',
  paid: 'Lunas',
  cancelled: 'Dibatalkan',
  used: 'Sudah Digunakan',
  expired: 'Kedaluwarsa',
}

export default function MyTickets() {
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // /api/bookings hanya mengembalikan booking milik user yang sedang login (dijamin di backend)
    api.get('/api/bookings')
      .then(({ data }) => setBookings(data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-lagoon-950 mb-6">Tiket Saya</h1>

        {location.state?.justBooked && (
          <div className="mb-6 rounded-lg bg-lagoon-500/10 border border-lagoon-500 text-lagoon-900 text-sm px-4 py-3">
            Pemesanan berhasil dibuat dengan kode <strong>{location.state.justBooked}</strong>.
          </div>
        )}

        {loading && <p className="text-lagoon-700">Memuat…</p>}

        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-lagoon-900/5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-display text-lg text-lagoon-950">{b.destination?.name}</p>
                  <p className="text-sm text-lagoon-700">Kode: {b.booking_code}</p>
                  <p className="text-sm text-lagoon-700">Tanggal kunjungan: {b.visit_date}</p>
                </div>
                <span className="text-xs font-semibold rounded-full bg-dusk-500/10 text-dusk-600 px-3 py-1">
                  {statusLabel[b.status] || b.status}
                </span>
              </div>
              <p className="mt-3 font-semibold text-lagoon-950">
                Total: Rp{Number(b.total_amount).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>

        {!loading && bookings.length === 0 && (
          <p className="text-lagoon-700">Belum ada tiket. Yuk pesan destinasi favoritmu!</p>
        )}
      </div>
    </div>
  )
}
