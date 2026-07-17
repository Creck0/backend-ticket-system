import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import DestinationCard from '../components/DestinationCard.jsx'
import api from '../api/axios.js'

export default function Home() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/destinations')
      .then(({ data }) => setDestinations(data.data ?? []))
      .catch(() => setError('Gagal memuat destinasi. Coba muat ulang halaman.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-lagoon-950 text-sand">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="uppercase tracking-[0.3em] text-dusk-500 text-xs font-semibold mb-4">
            Jelajah Nusa · Tiket Wisata Resmi
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-tight max-w-2xl text-white">
            Satu tiket, seribu cerita di ujung nusantara.
          </h1>
          <p className="mt-5 max-w-lg text-lagoon-300 font-body">
            Pesan tiket masuk destinasi wisata favoritmu — cepat, aman, dan langsung terverifikasi di gerbang.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="font-display text-2xl text-lagoon-950 mb-6">Destinasi Pilihan</h2>

        {error && <p className="text-dusk-600 mb-4">{error}</p>}
        {loading && <p className="text-lagoon-700">Memuat destinasi…</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>

        {!loading && destinations.length === 0 && !error && (
          <p className="text-lagoon-700">Belum ada destinasi yang tersedia saat ini.</p>
        )}
      </section>
    </div>
  )
}
