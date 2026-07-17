import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import api, { ensureCsrfCookie } from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function DestinationDetail() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [destination, setDestination] = useState(null)
  const [visitDate, setVisitDate] = useState('')
  const [quantities, setQuantities] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/api/destinations/${slug}`).then(({ data }) => setDestination(data))
  }, [slug])

  const handleQtyChange = (ticketTypeId, value) => {
    // Batasi input di sisi client (kenyamanan saja); validasi keras tetap di server
    const qty = Math.max(0, Math.min(20, Number(value) || 0))
    setQuantities((prev) => ({ ...prev, [ticketTypeId]: qty }))
  }

  const handleBook = async (e) => {
    e.preventDefault()
    setError('')

    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([ticket_type_id, quantity]) => ({ ticket_type_id: Number(ticket_type_id), quantity }))

    if (!user) return navigate('/masuk')
    if (!visitDate || items.length === 0) {
      setError('Pilih tanggal kunjungan dan minimal satu jenis tiket.')
      return
    }

    setSubmitting(true)
    try {
      await ensureCsrfCookie()
      const { data } = await api.post('/api/bookings', {
        destination_slug: slug,
        visit_date: visitDate,
        items,
      })
      navigate(`/tiket-saya`, { state: { justBooked: data.booking_code } })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pemesanan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!destination) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="text-center py-20 text-lagoon-700">Memuat destinasi…</p>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-dusk-600 font-semibold mb-2">
          {destination.location}
        </p>
        <h1 className="font-display text-4xl text-lagoon-950 mb-4">{destination.name}</h1>
        <p className="text-lagoon-700 mb-8 max-w-2xl">{destination.description}</p>

        <form onSubmit={handleBook} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-lagoon-900/5 space-y-5">
          <h2 className="font-display text-xl text-lagoon-950">Pesan Tiket</h2>

          {error && <p className="text-sm text-dusk-600">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-lagoon-900 mb-1">Tanggal kunjungan</label>
            <input
              type="date"
              min={today}
              required
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="rounded-lg border border-lagoon-300 px-3 py-2"
            />
          </div>

          <div className="space-y-3">
            {destination.ticket_types?.map((tt) => (
              <div key={tt.id} className="flex items-center justify-between border-b border-lagoon-100 pb-3">
                <div>
                  <p className="font-medium text-lagoon-950">{tt.name}</p>
                  <p className="text-sm text-lagoon-700">Rp{Number(tt.price).toLocaleString('id-ID')}</p>
                </div>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={quantities[tt.id] || 0}
                  onChange={(e) => handleQtyChange(tt.id, e.target.value)}
                  className="w-20 rounded-lg border border-lagoon-300 px-3 py-1.5 text-center"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-dusk-500 text-lagoon-950 font-semibold py-2.5 hover:bg-dusk-600 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Memproses…' : 'Pesan Sekarang'}
          </button>
          <p className="text-xs text-lagoon-700 text-center">
            Total harga dihitung ulang & diverifikasi oleh server saat checkout.
          </p>
        </form>
      </div>
    </div>
  )
}
