import React, { useEffect, useState } from 'react'

function RestaurantList({ onSelect }) {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      try {
        const res = await fetch(`${baseUrl}/restaurants`)
        if (res.ok) {
          const data = await res.json()
          setRestaurants(data)
        } else {
          setRestaurants([])
        }
      } catch (e) {
        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [])

  if (loading) return <div className="animate-pulse text-slate-500">Loading restaurants…</div>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map(r => (
        <button
          key={r.id}
          onClick={() => onSelect(r)}
          className="text-left bg-white rounded-xl shadow hover:shadow-md transition p-4 border border-slate-100"
        >
          <img src={r.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop'} alt={r.name} className="h-40 w-full object-cover rounded-lg" />
          <div className="mt-3">
            <h3 className="font-semibold text-slate-900">{r.name}</h3>
            <p className="text-sm text-slate-600">{r.cuisine} • ~{r.avg_prep_minutes} min prep</p>
            <p className="text-xs text-slate-500">{r.address}</p>
          </div>
        </button>
      ))}
      {restaurants.length === 0 && (
        <div className="col-span-full text-center text-slate-500">
          No restaurants yet. Try seeding data from the status page.
        </div>
      )}
    </div>
  )
}

export default RestaurantList
