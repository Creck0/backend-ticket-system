import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// OWASP A01: proteksi route di frontend HANYA untuk UX.
// Otorisasi sesungguhnya tetap divalidasi ulang di backend (middleware auth:sanctum / admin).
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="p-10 text-center text-lagoon-700">Memuat…</div>
  if (!user) return <Navigate to="/masuk" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />

  return children
}
