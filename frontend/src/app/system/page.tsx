'use client'

import React from 'react'
import Card from '@/src/components/Card'
import ApiHealthDashboard from './components/ApiHealthDashboard'
import ModuleStatusGrid from './components/ModuleStatusGrid'
import LogViewer from './components/LogViewer'

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600 mt-2">
            Monitor API health, module status, and system logs in real-time
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <ApiHealthDashboard />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModuleStatusGrid />
            <LogViewer />
          </div>
        </div>
      </div>
    </div>
  )
}
