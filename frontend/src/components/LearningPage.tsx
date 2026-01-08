'use client'

import React from 'react'
import ProgressDashboard from './ProgressDashboard'

/**
 * Learning Dashboard Tab Page
 * Shows learning progress and concept mastery
 */
export default function LearningPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Learning Dashboard</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Track your programming progress and explore concepts you've mastered
        </p>
      </div>

      <ProgressDashboard />

      {/* Learning Tips */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">💡 Learning Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--color-muted)]">
          <div>
            <h4 className="font-medium text-white mb-2">Enable Teaching Mode</h4>
            <p>Turn on Teaching Mode in the Code Editor to receive detailed explanations as you code.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Practice Regularly</h4>
            <p>Try the code challenges and games to apply concepts and build muscle memory.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Explore Concepts</h4>
            <p>Browse the concept graph to understand relationships between programming concepts.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Build Projects</h4>
            <p>Use the visual flowchart editor to plan and build larger projects.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
