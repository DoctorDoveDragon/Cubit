'use client'

import React, { useState } from 'react'
import SettingsPanel from './SettingsPanel'
import CreativeCommandsPanel from './CreativeCommandsPanel'

/**
 * Settings Tab Page
 * Application settings and creative commands
 */
export default function SettingsPage() {
  const [showCreativeCommands, setShowCreativeCommands] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Settings & Tools</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Configure your development environment and access creative tools
        </p>
      </div>

      {/* Application Settings */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Application Settings</h3>
        <SettingsPanel />
      </div>

      {/* Creative Commands */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Creative Commands</h3>
          <button
            onClick={() => setShowCreativeCommands(!showCreativeCommands)}
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            {showCreativeCommands ? 'Hide' : 'Show'} Commands
          </button>
        </div>
        
        {showCreativeCommands && <CreativeCommandsPanel />}
      </div>

      {/* System Information */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">System Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-[var(--color-muted)]">Version</div>
            <div className="font-mono">1.0.0</div>
          </div>
          <div>
            <div className="text-[var(--color-muted)]">Node Version</div>
            <div className="font-mono">20.18.1</div>
          </div>
          <div>
            <div className="text-[var(--color-muted)]">Framework</div>
            <div className="font-mono">Next.js 16</div>
          </div>
          <div>
            <div className="text-[var(--color-muted)]">API Status</div>
            <div className="font-mono text-green-400">Connected</div>
          </div>
        </div>
      </div>
    </div>
  )
}
