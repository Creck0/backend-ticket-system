import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api, { ensureCsrfCookie } from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get('/api/me')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
    const onUnauthorized = () => setUser(null)
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [fetchMe])

  const login = async (email, password) => {
    await ensureCsrfCookie()
    const { data } = await api.post('/api/login', { email, password })
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    await ensureCsrfCookie()
    const { data } = await api.post('/api/register', payload)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await api.post('/api/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
