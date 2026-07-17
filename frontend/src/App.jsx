import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DestinationDetail from './pages/DestinationDetail.jsx'
import MyTickets from './pages/MyTickets.jsx'
import AdminDestinations from './pages/AdminDestinations.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/masuk" element={<Login />} />
      <Route path="/daftar" element={<Register />} />
      <Route path="/destinasi/:slug" element={<DestinationDetail />} />
      <Route
        path="/tiket-saya"
        element={<ProtectedRoute><MyTickets /></ProtectedRoute>}
      />
      <Route
        path="/admin"
        element={<ProtectedRoute adminOnly><AdminDestinations /></ProtectedRoute>}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
