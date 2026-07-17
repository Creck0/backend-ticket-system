import React from 'react'
import { Link } from 'react-router-dom'

export default function DestinationCard({ destination }) {
  const lowestPrice = destination.ticket_types?.length
    ? Math.min(...destination.ticket_types.map((t) => Number(t.price)))
    : null

  return (
    <Link
      to={`/destinasi/${destination.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-lagoon-900/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-44 bg-lagoon-500/20 relative overflow-hidden">
        {destination.image_path ? (
          <img
            src={destination.image_path}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lagoon-700 font-display text-lg">
            {destination.name}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-dusk-600 font-semibold mb-1">
          {destination.location}
        </p>
        <h3 className="font-display text-xl text-lagoon-950 mb-2">{destination.name}</h3>
        {/* React auto-escape teks -> aman dari XSS meski description berasal dari server (defense-in-depth) */}
        <p className="text-sm text-lagoon-700 line-clamp-2">{destination.description}</p>
        {lowestPrice !== null && (
          <p className="mt-3 text-sm font-semibold text-lagoon-900">
            Mulai Rp{lowestPrice.toLocaleString('id-ID')}
          </p>
        )}
      </div>
    </Link>
  )
}
