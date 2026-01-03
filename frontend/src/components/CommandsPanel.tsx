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

  const collectRootTokens = (): Record<string, string> => {
    const styles: Record<string, string> = {}
    const root = document.documentElement
    // collect known tokens from computed styles by reading the variables used in :root sample list
    const sample = ['--color-bg','--color-surface','--color-accent','--color-muted','--radius','--spacing-base']
    sample.forEach((k) => {
      const v = getComputedStyle(root).getPropertyValue(k).trim()
      if (v) styles[k.replace('--','')] = v
    })
    return styles
  }

  const handleExportTokens = async () => {
    try {
      const tokens = collectRootTokens()
      const json = JSON.stringify(tokens, null, 2)
      await navigator.clipboard.writeText(json)

      // trigger download
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tokens.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      setToast('Design tokens copied & downloaded')
    } catch (e) {
      setToast('Export failed — check clipboard/download permissions')
    }
  }

  const handleCopyComponent = async () => {
    const component = `import React from 'react'\n\nexport default function ExampleButton({ children, className }: { children: React.ReactNode; className?: string }) {\n  return (\n    <button className={"rounded-md px-3 py-2 text-sm font-medium bg-[var(--color-accent)] text-black " + (className ? ' ' + className : '')}>\n      {children}\n    </button>\n  )\n}\n\n// Usage: <ExampleButton>Click me</ExampleButton>`

    try {
      await navigator.clipboard.writeText(component)
      setToast('Component code copied to clipboard')
    } catch (e) {
      setToast('Copy failed — check clipboard permissions')
    }
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
        <Button onClick={handleCopyComponent}>Copy component</Button>
        <Button onClick={handleToggleTheme}>Toggle theme</Button>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
