import React from 'react'

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Cubit Design System</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Code-first designer scaffold
        </p>
      </div>
    </header>
  )
}
