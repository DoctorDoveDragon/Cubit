import React, { useState } from 'react'
import Button from './Button'
import Toast from './Toast'

export default function CommandsPanel({ onGenerate }: { onGenerate: (text: string) => void }) {
  const [toast, setToast] = useState<string | null>(null)

  const handleGenerate = () => {
    // Simulate generating a project description from a prompt
    const generated = 'Generated project description — A modern, component-driven design system for Cubit.'
    onGenerate(generated)
    setToast('Description generated')
  }

  const handleExportTokens = async () => {
    const tokens = Array.from(document.styleSheets)
      .flatMap((sheet: any) => Array.from(sheet.cssRules || []))
      .filter((r: any) => r.selectorText === ':root')
      .map((r: any) => r.cssText)
      .join('\n')

    try {
      await navigator.clipboard.writeText(tokens || '/* tokens not found */')
      setToast('Design tokens copied to clipboard')
    } catch (e) {
      setToast('Copy failed — check clipboard permissions')
    }
  }

  const handleOpenFigma = () => {
    // Placeholder Figma URL — user can replace with real file
    window.open('https://www.figma.com/', '_blank')
    setToast('Opening Figma')
  }

  const handleToggleTheme = () => {
    const root = document.documentElement
    const current = root.getAttribute('data-theme') || 'dark'
    if (current === 'dark') {
      // light theme tokens
      root.style.setProperty('--color-bg', '#f8fafc')
      root.style.setProperty('--color-surface', '#ffffff')
      root.style.setProperty('--color-accent', '#7c3aed')
      root.style.setProperty('--color-muted', '#475569')
      root.setAttribute('data-theme', 'light')
      setToast('Switched to light theme')
    } else {
      root.style.setProperty('--color-bg', '#0f172a')
      root.style.setProperty('--color-surface', '#0b1220')
      root.style.setProperty('--color-accent', '#7c3aed')
      root.style.setProperty('--color-muted', '#94a3b8')
      root.setAttribute('data-theme', 'dark')
      setToast('Switched to dark theme')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={handleGenerate}>Generate description</Button>
        <Button onClick={handleExportTokens}>Export tokens</Button>
        <Button onClick={handleOpenFigma}>Open Figma</Button>
        <Button onClick={handleToggleTheme}>Toggle theme</Button>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
