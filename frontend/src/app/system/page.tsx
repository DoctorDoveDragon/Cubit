'use client'

import ApiHealthDashboard from './components/ApiHealthDashboard'
import ModuleStatusGrid from './components/ModuleStatusGrid'

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Health</h1>
          <p className="text-gray-400">
            Monitor API health and system module status in real-time
          </p>
        </div>

        <div className="space-y-6">
          <ApiHealthDashboard />
          <ModuleStatusGrid />
        </div>
      </div>
    </div>
  )
}
