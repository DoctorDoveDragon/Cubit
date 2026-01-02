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
    </aside>
  )
}
