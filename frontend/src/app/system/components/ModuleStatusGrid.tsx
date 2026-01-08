'use client'

import { useEffect, useState } from 'react'
import { getModuleStatus } from '@/utils/api'
import type { Module, ModuleStatusResponse } from '@/types/api'

export default function ModuleStatusGrid() {
  const [data, setData] = useState<ModuleStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getModuleStatus()
        setData(result)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch status')
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Module Status</h2>
        <div className="text-gray-400">Loading module status...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Module Status</h2>
        <div className="text-red-400">
          Failed to load module status. Make sure the backend API is running.
        </div>
      </div>
    )
  }

  const typeColors: Record<Module['type'], string> = {
    core: 'border-blue-500',
    pedagogical: 'border-purple-500',
    game: 'border-green-500',
    api: 'border-orange-500',
  }

  const statusColors: Record<Module['status'], string> = {
    active: 'bg-green-500',
    error: 'bg-red-500',
    inactive: 'bg-gray-500',
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Module Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Total Modules</div>
          <div className="text-2xl font-bold">{data.system.total_modules}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Active Modules</div>
          <div className="text-2xl font-bold text-green-400">{data.system.active_modules}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Error Modules</div>
          <div className="text-2xl font-bold text-red-400">{data.system.error_modules}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Uptime</div>
          <div className="text-2xl font-bold">{Math.floor(data.system.uptime_seconds / 60)}m</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.modules.map((module: Module) => (
          <div 
            key={module.id} 
            className={`bg-gray-800 rounded-lg p-4 border-l-4 ${typeColors[module.type]}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold">{module.name}</div>
                <div className="text-xs text-gray-400 capitalize">{module.type}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${statusColors[module.status]}`} />
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Requests:</span>
                <span>{module.metrics.total_requests}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Success:</span>
                <span className="text-green-400">{module.metrics.successful_requests}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Failed:</span>
                <span className="text-red-400">{module.metrics.failed_requests}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Avg Time:</span>
                <span>{module.metrics.avg_response_time_ms.toFixed(2)} ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
