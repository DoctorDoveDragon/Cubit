'use client'

import ApiHealthDashboard from './components/ApiHealthDashboard'
import ModuleStatusGrid from './components/ModuleStatusGrid'

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Monitor</h1>
          <p className="text-gray-400">
            Real-time system health and module status monitoring
          </p>
        </header>

        <div className="space-y-6">
          <ApiHealthDashboard />
          <ModuleStatusGrid />
        </div>
      </div>
    </div>
  )
}
