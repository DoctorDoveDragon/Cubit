'use client'

import React from 'react'
import ApiHealthIndicator from './ApiHealthIndicator'

export type TabId = 'code-editor' | 'visual-flowchart' | 'code-analysis' | 'learning' | 'settings'

interface Tab {
  id: TabId
  label: string
  icon: string
}

interface TabbedHeaderProps {
  activeTab: TabId
  onTabChange: (tabId: TabId) => void
}

const tabs: Tab[] = [
  { id: 'code-editor', label: 'Code Editor', icon: '📝' },
  { id: 'visual-flowchart', label: 'Visual Flowchart', icon: '🎨' },
  { id: 'code-analysis', label: 'Code Analysis', icon: '📊' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]

export default function TabbedHeader({ activeTab, onTabChange }: TabbedHeaderProps) {
  return (
    <header className="border-b border-[rgba(255,255,255,0.12)] bg-[var(--color-surface)] sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <h1 className="text-xl font-bold">Cubit Design System</h1>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">Powerful Simplicity</p>
        </div>
        <div className="flex gap-3 items-center">
          <ApiHealthIndicator />
          <span className="text-xs text-[var(--color-muted)]">v1.0.0</span>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <nav className="flex px-6 gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium whitespace-nowrap
              border-b-2 transition-all duration-200
              ${activeTab === tab.id
                ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[rgba(124,58,237,0.1)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
