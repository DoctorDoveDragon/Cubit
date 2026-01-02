import React, { useState } from 'react'
import Button from './Button'
import Toast from './Toast'

const THEMES = {
  light: {
    '--color-bg': '#f8fafc',
    '--color-surface': '#ffffff',
    '--color-accent': '#7c3aed',
    '--color-muted': '#475569',
  },
  dark: {
    '--color-bg': '#0f172a',
    '--color-surface': '#0b1220',
    '--color-accent': '#7c3aed',
    '--color-muted': '#94a3b8',
  },
} as const

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
      .flatMap((sheet) => {
        try {
          return Array.from(sheet.cssRules || [])
        } catch {
          return []
        }
      })
      .filter((r): r is CSSStyleRule => r instanceof CSSStyleRule && r.selectorText === ':root')
      .map((r) => r.cssText)
      .join('\n')

    try {
      await navigator.clipboard.writeText(tokens || '/* tokens not found */')
      setToast('Design tokens copied to clipboard')
    } catch {
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
    const newTheme = current === 'dark' ? 'light' : 'dark'
    const themeConfig = THEMES[newTheme]

    Object.entries(themeConfig).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    root.setAttribute('data-theme', newTheme)
    setToast(`Switched to ${newTheme} theme`)
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
