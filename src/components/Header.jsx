import React from 'react'

function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/60 backdrop-blur-xl border-b border-white/40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="Logo" className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Blue Dine Preorder</h1>
            <p className="text-xs text-slate-600 -mt-1">Order ahead. Walk in. Eat immediately.</p>
          </div>
        </div>
        <a href="/test" className="text-sm text-blue-700 hover:text-blue-800">System status</a>
      </div>
    </header>
  )
}

export default Header
