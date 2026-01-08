'use client'

import { useEffect, useState } from 'react'
import { getModuleStatus } from '@/utils/api'
import type { ModuleStatusResponse, Module } from '@/types/api'

export default function ModuleStatusGrid() {
  const [data, setData] = useState<ModuleStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getModuleStatus()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load module status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchStatus, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: Module['status']) => {
    const colors = {
      active: 'bg-green-500/20 text-green-400 border-green-500/50',
      inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      error: 'bg-red-500/20 text-red-400 border-red-500/50',
    }
    return colors[status] || colors.inactive
  }

  const getTypeIcon = (type: Module['type']) => {
    const icons = {
      core: '⚙️',
      pedagogical: '🎓',
      game: '🎮',
      api: '🔌',
    }
    return icons[type] || '📦'
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-400">Loading module status...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-12 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={fetchStatus}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data || !data.modules || data.modules.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-12 text-center">
        <p className="text-gray-400">No modules found</p>
      </div>
    )
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Module Status</h2>
        <button
          onClick={fetchStatus}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* System Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total Modules</div>
          <div className="text-3xl font-bold">{data.system.total_modules}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Active</div>
          <div className="text-3xl font-bold text-green-400">{data.system.active_modules}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Errors</div>
          <div className="text-3xl font-bold text-red-400">{data.system.error_modules}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Uptime</div>
          <div className="text-2xl font-bold">{formatUptime(data.system.uptime_seconds)}</div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.modules.map((module) => (
          <div key={module.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(module.type)}</span>
                <div>
                  <h3 className="font-semibold text-white">{module.name}</h3>
                  <p className="text-xs text-gray-400">{module.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(module.status)}`}>
                {module.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version</span>
                <span className="text-white font-mono">{module.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Requests</span>
                <span className="text-white">{module.metrics.total_requests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-white">
                  {module.metrics.total_requests > 0
                    ? `${((module.metrics.successful_requests / module.metrics.total_requests) * 100).toFixed(1)}%`
                    : 'N/A'}
                </span>
              </div>
              {module.metrics.average_duration_ms > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Duration</span>
                  <span className="text-white font-mono">{module.metrics.average_duration_ms.toFixed(2)}ms</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
