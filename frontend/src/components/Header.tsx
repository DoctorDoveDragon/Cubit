import React from 'react'

export default function Header(){
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Cubit</h1>
        <p className="text-sm text-[var(--color-muted)]">Designer-focused UI scaffold</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-2 rounded-md bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[rgba(255,255,255,0.02)]">Preview</button>
        <div className="h-10 w-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] font-semibold">DD</div>
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
