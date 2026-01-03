import React from 'react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-[rgba(124,58,237,0.1)] p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Cubit</h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">Design System</p>
      </div>
      <nav className="space-y-2">
        <div className="px-3 py-2 rounded-md bg-[rgba(124,58,237,0.1)] text-[var(--color-accent)] text-sm font-medium">
          Dashboard
        </div>
        <div className="px-3 py-2 rounded-md text-[var(--color-muted)] text-sm hover:bg-[rgba(124,58,237,0.05)]">
          Components
        </div>
        <div className="px-3 py-2 rounded-md text-[var(--color-muted)] text-sm hover:bg-[rgba(124,58,237,0.05)]">
          Tokens
        </div>
        <div className="px-3 py-2 rounded-md text-[var(--color-muted)] text-sm hover:bg-[rgba(124,58,237,0.05)]">
          Storybook
        </div>
      </nav>
    </aside>
  )
}
