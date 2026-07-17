import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 bg-lagoon-950/95 backdrop-blur text-sand border-b border-lagoon-700">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-tight text-white">
          Jelajah <span className="text-dusk-500">Nusa</span>
        </Link>
        <div className="flex items-center gap-6 font-body text-sm">
          <Link to="/" className="hover:text-dusk-300 transition-colors">Destinasi</Link>
          {user ? (
            <>
              <Link to="/tiket-saya" className="hover:text-dusk-300 transition-colors">Tiket Saya</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-dusk-300 transition-colors">Kelola Destinasi</Link>
              )}
              <span className="text-lagoon-300">Halo, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-dusk-500 px-4 py-1.5 hover:bg-dusk-500 hover:text-lagoon-950 transition-colors"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/masuk" className="hover:text-dusk-300 transition-colors">Masuk</Link>
              <Link
                to="/daftar"
                className="rounded-full bg-dusk-500 px-4 py-1.5 text-lagoon-950 font-semibold hover:bg-dusk-600 transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
