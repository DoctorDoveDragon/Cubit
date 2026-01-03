import React from 'react'

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Cubit Design System</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Designer-focused component scaffold</p>
      </div>
      <div className="flex gap-3 items-center">
        <span className="text-xs text-[var(--color-muted)]">v1.0.0</span>
      </div>
    </header>
  )
}
