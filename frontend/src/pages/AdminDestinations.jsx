import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import api, { ensureCsrfCookie } from '../api/axios.js'

export default function AdminDestinations() {
  const [form, setForm] = useState({
    name: '', location: '', description: '', quota_per_day: 100,
  })
  const [ticketTypes, setTicketTypes] = useState([{ name: '', price: '', stock: '' }])
  const [image, setImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateTicketType = (i, key, value) => {
    setTicketTypes((prev) => prev.map((tt, idx) => (idx === i ? { ...tt, [key]: value } : tt)))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    // Validasi ringan di client (UX); server tetap mem-validasi MIME asli & ukuran (OWASP A03/A04)
    if (file && file.size > 2 * 1024 * 1024) {
      setErrors({ image: ['Ukuran gambar maksimal 2MB.'] })
      return
    }
    setImage(file || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setMessage('')
    setSubmitting(true)

    const payload = new FormData()
    Object.entries(form).forEach(([k, v]) => payload.append(k, v))
    ticketTypes.forEach((tt, i) => {
      payload.append(`ticket_types[${i}][name]`, tt.name)
      payload.append(`ticket_types[${i}][price]`, tt.price)
      payload.append(`ticket_types[${i}][stock]`, tt.stock)
    })
    if (image) payload.append('image', image)

    try {
      await ensureCsrfCookie()
      await api.post('/api/admin/destinations', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage('Destinasi berhasil ditambahkan.')
      setForm({ name: '', location: '', description: '', quota_per_day: 100 })
      setTicketTypes([{ name: '', price: '', stock: '' }])
      setImage(null)
    } catch (err) {
      setErrors(err.response?.data?.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-lagoon-950 mb-2">Kelola Destinasi</h1>
        <p className="text-sm text-lagoon-700 mb-6">
          Halaman ini hanya dapat diakses oleh admin (dicek ulang oleh server, bukan cuma tersembunyi di UI).
        </p>

        {message && <p className="mb-4 text-sm text-lagoon-900 bg-lagoon-500/10 rounded-lg px-4 py-2">{message}</p>}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-lagoon-900/5 space-y-4">
          <input
            placeholder="Nama destinasi"
            required maxLength={150}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-lagoon-300 px-3 py-2"
          />
          {errors.name && <p className="text-xs text-dusk-600">{errors.name[0]}</p>}

          <input
            placeholder="Lokasi"
            required maxLength={150}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded-lg border border-lagoon-300 px-3 py-2"
          />

          <textarea
            placeholder="Deskripsi"
            required maxLength={5000}
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-lagoon-300 px-3 py-2"
          />

          <div>
            <label className="block text-sm font-medium text-lagoon-900 mb-1">Kuota per hari</label>
            <input
              type="number" min={1} max={100000} required
              value={form.quota_per_day}
              onChange={(e) => setForm({ ...form, quota_per_day: e.target.value })}
              className="w-full rounded-lg border border-lagoon-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-lagoon-900 mb-1">Gambar (jpg/png/webp, maks 2MB)</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
            {errors.image && <p className="text-xs text-dusk-600 mt-1">{errors.image[0]}</p>}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-lagoon-900">Jenis tiket</p>
            {ticketTypes.map((tt, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input
                  placeholder="Nama" required maxLength={100}
                  value={tt.name}
                  onChange={(e) => updateTicketType(i, 'name', e.target.value)}
                  className="rounded-lg border border-lagoon-300 px-2 py-1.5 text-sm"
                />
                <input
                  placeholder="Harga" type="number" min={0} required
                  value={tt.price}
                  onChange={(e) => updateTicketType(i, 'price', e.target.value)}
                  className="rounded-lg border border-lagoon-300 px-2 py-1.5 text-sm"
                />
                <input
                  placeholder="Stok" type="number" min={0} required
                  value={tt.stock}
                  onChange={(e) => updateTicketType(i, 'stock', e.target.value)}
                  className="rounded-lg border border-lagoon-300 px-2 py-1.5 text-sm"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setTicketTypes((prev) => [...prev, { name: '', price: '', stock: '' }])}
              className="text-sm text-lagoon-900 underline"
            >
              + Tambah jenis tiket
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-dusk-500 text-lagoon-950 font-semibold py-2.5 hover:bg-dusk-600 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Menyimpan…' : 'Simpan Destinasi'}
          </button>
        </form>
      </div>
    </div>
  )
}
