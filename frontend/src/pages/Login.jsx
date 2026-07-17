import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      // Tampilkan pesan generik dari server (server sengaja tidak membocorkan
      // apakah email terdaftar atau tidak - mitigasi user enumeration)
      setError(err.response?.data?.message || 'Email atau password salah.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-lagoon-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-sand rounded-2xl p-8 shadow-xl">
        <h1 className="font-display text-3xl text-lagoon-950 mb-1">Selamat datang kembali</h1>
        <p className="text-sm text-lagoon-700 mb-6">Masuk untuk melanjutkan pemesanan tiketmu.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-dusk-500/10 border border-dusk-500 text-dusk-600 text-sm px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on" noValidate>
          <div>
            <label className="block text-sm font-medium text-lagoon-900 mb-1">Email</label>
            <input
              type="email"
              required
              maxLength={255}
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-lagoon-300 px-3 py-2 focus:border-lagoon-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-lagoon-900 mb-1">Kata sandi</label>
            <input
              type="password"
              required
              maxLength={255}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-lagoon-300 px-3 py-2 focus:border-lagoon-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-dusk-500 text-lagoon-950 font-semibold py-2.5 hover:bg-dusk-600 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Memproses…' : 'Masuk'}
          </button>
        </form>

        <p className="mt-5 text-sm text-lagoon-700 text-center">
          Belum punya akun?{' '}
          <Link to="/daftar" className="text-lagoon-900 font-semibold underline">Daftar</Link>
        </p>
      </div>
    </div>
  )
}
