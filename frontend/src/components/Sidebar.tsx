import React from 'react'

export default function Sidebar(){
  return (
    <aside className="w-72 bg-[var(--color-surface)]/60 p-6 border-r border-[rgba(255,255,255,0.03)]">
      <div className="mb-6">
        <div className="text-sm text-[var(--color-muted)]">Workspace</div>
        <div className="mt-3 text-white font-medium">Design Lab</div>
      </div>

      <nav className="space-y-2">
        <a className="block py-2 px-3 rounded-md hover:bg-[rgba(255,255,255,0.02)]">Dashboard</a>
        <a className="block py-2 px-3 rounded-md hover:bg-[rgba(255,255,255,0.02)]">Components</a>
        <a className="block py-2 px-3 rounded-md hover:bg-[rgba(255,255,255,0.02)]">Tokens</a>
        <a className="block py-2 px-3 rounded-md hover:bg-[rgba(255,255,255,0.02)]">Deploy</a>
      </nav>

      <div className="mt-6 text-xs text-[var(--color-muted)]">
        Prototypes & design tokens sync
      </div>
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
