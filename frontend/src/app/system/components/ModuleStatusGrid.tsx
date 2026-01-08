'use client'

import React, { useEffect, useState } from 'react'
import { getModuleStatus } from '@/src/utils/api'
import type { Module } from '@/src/types/api'

export default function ModuleStatusGrid() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await getModuleStatus()
        setModules(data.modules)
      } catch (error) {
        console.error('Failed to load modules:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModules()
    const interval = setInterval(loadModules, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading modules...</div>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
      case 'error':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Error</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inactive</span>
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'core': return 'border-l-blue-500'
      case 'pedagogical': return 'border-l-purple-500'
      case 'game': return 'border-l-yellow-500'
      case 'api': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-800 text-white px-6 py-3 font-semibold">
        Module Status Grid
      </div>
      <div className="divide-y">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`p-4 border-l-4 ${getTypeColor(module.type)} hover:bg-gray-50 transition-colors`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{module.name}</h4>
                <p className="text-xs text-gray-500 capitalize">
                  {module.type} • v{module.version}
                </p>
              </div>
              {getStatusBadge(module.status)}
            </div>
            
            {module.metrics && (
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div>
                  <div className="text-gray-600">Requests</div>
                  <div className="font-medium">{module.metrics.total_requests}</div>
                </div>
                <div>
                  <div className="text-gray-600">Success Rate</div>
                  <div className="font-medium text-green-600">
                    {module.metrics.total_requests > 0
                      ? Math.round((module.metrics.successful_requests / module.metrics.total_requests) * 100)
                      : 0}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Time</div>
                  <div className="font-medium">{module.metrics.average_response_time_ms.toFixed(1)}ms</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
