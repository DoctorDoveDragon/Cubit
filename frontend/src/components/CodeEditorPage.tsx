'use client'

import React from 'react'
import CodeExecutor from './CodeExecutor'

/**
 * Code Editor Tab Page
 * Main code editing interface with execution capabilities
 */
export default function CodeEditorPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Code Editor</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Write and execute Cubit code with real-time analysis and teaching mode
        </p>
      </div>

      <CodeExecutor />
    </div>
  )
}
