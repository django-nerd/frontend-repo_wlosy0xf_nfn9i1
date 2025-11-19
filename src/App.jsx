import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import RestaurantList from './components/RestaurantList'
import MenuAndCart from './components/MenuAndCart'

function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [orderConfirmation, setOrderConfirmation] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    // Try to seed demo data on first load if nothing exists (non-blocking)
    const seed = async () => {
      try { await fetch(`${baseUrl}/seed`, { method: 'POST' }) } catch {}
    }
    seed()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {!selectedRestaurant && !orderConfirmation && (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Book Your Meal, Dine In On Time</h2>
              <p className="text-slate-600 mt-2">Choose a place, pre-order your food, and walk in when it's ready.</p>
            </div>
            <RestaurantList onSelect={setSelectedRestaurant} />
          </>
        )}

        {selectedRestaurant && !orderConfirmation && (
          <div>
            <button onClick={() => setSelectedRestaurant(null)} className="text-sm text-blue-600 mb-4">← Back</button>
            <div className="flex items-center gap-4 mb-6">
              <img src={selectedRestaurant.image} className="h-16 w-16 rounded object-cover" />
              <div>
                <h2 className="text-2xl font-semibold">{selectedRestaurant.name}</h2>
                <p className="text-slate-600">{selectedRestaurant.cuisine} • {selectedRestaurant.address}</p>
              </div>
            </div>
            <MenuAndCart restaurant={selectedRestaurant} onOrderPlaced={setOrderConfirmation} />
          </div>
        )}

        {orderConfirmation && (
          <div className="max-w-md mx-auto bg-white/70 backdrop-blur rounded-xl border border-white/40 shadow p-6 text-center">
            <h3 className="text-2xl font-bold">Order Confirmed</h3>
            <p className="text-slate-700/90 mt-2">Your order ID is <span className="font-mono">{orderConfirmation.orderId}</span></p>
            <p className="mt-1">Total: <span className="font-semibold">${orderConfirmation.total.toFixed(2)}</span></p>
            <p className="mt-1">Estimated prep time: <span className="font-semibold">~{orderConfirmation.eta} minutes</span></p>
            <a href="/" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">Place another order</a>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
