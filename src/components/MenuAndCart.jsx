import React, { useEffect, useMemo, useState } from 'react'

function MenuAndCart({ restaurant, onOrderPlaced }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState({})
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [dineInTime, setDineInTime] = useState('')
  const [placing, setPlacing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${baseUrl}/restaurants/${restaurant.id}/menu`)
        if (res.ok) setMenu(await res.json())
      } catch {}
    }
    fetchMenu()
  }, [restaurant.id])

  const addItem = (item) => {
    setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))
  }
  const removeItem = (item) => {
    setCart(prev => {
      const qty = (prev[item.id] || 0) - 1
      const next = { ...prev }
      if (qty <= 0) delete next[item.id]
      else next[item.id] = qty
      return next
    })
  }

  const cartDetails = useMemo(() => {
    const lines = Object.entries(cart).map(([id, qty]) => {
      const item = menu.find(m => m.id === id)
      const price = item ? item.price : 0
      return { id, name: item?.name || 'Item', qty, price, lineTotal: price * qty }
    })
    const total = lines.reduce((s, l) => s + l.lineTotal, 0)
    return { lines, total }
  }, [cart, menu])

  const placeOrder = async () => {
    if (!customer.name || !customer.phone || !dineInTime || cartDetails.lines.length === 0) {
      setMessage('Please fill customer details, pick a time, and add items to cart.')
      return
    }
    setPlacing(true)
    setMessage('')

    const payload = {
      restaurant_id: restaurant.id,
      customer_name: customer.name,
      customer_phone: customer.phone,
      dine_in_time: new Date(dineInTime).toISOString(),
      items: cartDetails.lines.map(l => ({ menu_item_id: l.id, quantity: l.qty })),
      special_requests: ''
    }

    try {
      const res = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        onOrderPlaced({ orderId: data.id, total: data.total, eta: data.estimated_prep_minutes })
      } else {
        setMessage('Failed to place order.')
      }
    } catch (e) {
      setMessage('Network error while placing order.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-semibold">Menu</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {menu.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow">
              {item.image && <img src={item.image} alt={item.name} className="h-36 w-full object-cover rounded" />}
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{item.name}</h4>
                  <span className="text-slate-700">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => removeItem(item)} className="px-3 py-1 rounded bg-slate-100">-</button>
                  <button onClick={() => addItem(item)} className="px-3 py-1 rounded bg-blue-600 text-white">Add</button>
                </div>
              </div>
            </div>
          ))}
          {menu.length === 0 && (
            <div className="text-slate-500">No menu yet.</div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow">
          <h3 className="text-lg font-semibold mb-3">Your Visit</h3>
          <div className="space-y-2">
            <input value={customer.name} onChange={e => setCustomer(c => ({...c, name: e.target.value}))} placeholder="Your name" className="w-full border rounded px-3 py-2" />
            <input value={customer.phone} onChange={e => setCustomer(c => ({...c, phone: e.target.value}))} placeholder="Phone number" className="w-full border rounded px-3 py-2" />
            <input type="datetime-local" value={dineInTime} onChange={e => setDineInTime(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <h3 className="text-lg font-semibold mt-6">Cart</h3>
          <div className="divide-y">
            {cartDetails.lines.map(l => (
              <div key={l.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-slate-500">x{l.qty}</p>
                </div>
                <div className="text-slate-700">${l.lineTotal.toFixed(2)}</div>
              </div>
            ))}
            {cartDetails.lines.length === 0 && (
              <p className="text-slate-500 py-2">Your cart is empty.</p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold">${cartDetails.total.toFixed(2)}</span>
          </div>

          {message && <p className="text-sm text-red-600 mt-2">{message}</p>}

          <button disabled={placing} onClick={placeOrder} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded disabled:opacity-50">
            {placing ? 'Placing…' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MenuAndCart
