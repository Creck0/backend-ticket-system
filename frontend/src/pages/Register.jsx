import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', phone: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      // Tampilkan error validasi per-field dari Laravel (422) tanpa memodifikasi DOM langsung (aman dari XSS)
      setErrors(err.response?.data?.errors || { general: ['Registrasi gagal. Coba lagi.'] })
    } finally {
      setSubmitting(false)
    }
  }

  const fieldError = (name) => errors[name]?.[0]

  return (
    <div className="min-h-screen bg-lagoon-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm bg-sand rounded-2xl p-8 shadow-xl">
        <h1 className="font-display text-3xl text-lagoon-950 mb-1">Buat akun baru</h1>
        <p className="text-sm text-lagoon-700 mb-6">Mulai jelajahi destinasi favoritmu.</p>

        {errors.general && (
          <div className="mb-4 rounded-lg bg-dusk-500/10 border border-dusk-500 text-dusk-600 text-sm px-4 py-2">
            {errors.general[0]}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {[
            { key: 'name', label: 'Nama lengkap', type: 'text', autoComplete: 'name' },
            { key: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
            { key: 'phone', label: 'No. HP (opsional, format: 6281234567890)', type: 'tel', autoComplete: 'tel', pattern: '\\+?[0-9]{8,15}' },
            { key: 'password', label: 'Kata sandi', type: 'password', autoComplete: 'new-password' },
            { key: 'password_confirmation', label: 'Ulangi kata sandi', type: 'password', autoComplete: 'new-password' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-lagoon-900 mb-1">{f.label}</label>
  	 <input
  	type={f.type}
  	required={f.key !== 'phone'}
  	maxLength={f.key === 'phone' ? 16 : 255}
  	pattern={f.pattern}
  	autoComplete={f.autoComplete}
  	value={form[f.key]}
  	onChange={(e) => {
    	const raw = e.target.value
    	const cleaned = f.key === 'phone'
      	? raw.replace(/(?!^\+)[^\d]/g, '')
      	: raw
    	setForm({ ...form, [f.key]: cleaned })
  	}}
  	className="w-full rounded-lg border border-lagoon-300 px-3 py-2 focus:border-lagoon-500 outline-none"
/>
              {fieldError(f.key) && <p className="text-xs text-dusk-600 mt-1">{fieldError(f.key)}</p>}
            </div>
          ))}

          <p className="text-xs text-lagoon-700">
            Gunakan minimal 10 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-dusk-500 text-lagoon-950 font-semibold py-2.5 hover:bg-dusk-600 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Memproses…' : 'Daftar'}
          </button>
        </form>

        <p className="mt-5 text-sm text-lagoon-700 text-center">
          Sudah punya akun?{' '}
          <Link to="/masuk" className="text-lagoon-900 font-semibold underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
