import React from 'react'

export default function Sidebar() {
  const menuItems = [
    { label: 'Overview', active: true },
    { label: 'Components', active: false },
    { label: 'Tokens', active: false },
    { label: 'Storybook', active: false },
  ]

  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-[rgba(255,255,255,0.08)] p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--color-accent)]">Cubit</h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">Design System</p>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
              item.active
                ? 'bg-[rgba(124,58,237,0.15)] text-[var(--color-accent)]'
                : 'text-[var(--color-muted)] hover:bg-[rgba(255,255,255,0.05)]'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
