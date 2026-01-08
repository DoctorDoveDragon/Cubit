'use client'

import type { Module } from '@/types/api'

interface ModuleInspectorProps {
  module: Module | null
}

export default function ModuleInspector({ module }: ModuleInspectorProps) {
  if (!module) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Select a module to view details</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: Module['status']) => {
    const colors = {
      active: 'bg-green-500/20 text-green-400 border-green-500/50',
      inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      error: 'bg-red-500/20 text-red-400 border-red-500/50',
    }
    return colors[status] || colors.inactive
  }

  const getTypeBadge = (type: Module['type']) => {
    const colors = {
      core: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      pedagogical: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      game: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      api: 'bg-green-500/20 text-green-400 border-green-500/50',
    }
    return colors[type] || colors.core
  }

  const successRate = module.metrics.total_requests > 0
    ? ((module.metrics.successful_requests / module.metrics.total_requests) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-[600px] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{module.name}</h2>
        <p className="text-gray-400 text-sm">ID: {module.id}</p>
      </div>

      <div className="space-y-4">
        {/* Status & Type */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Status & Type</h3>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(module.status)}`}>
              {module.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadge(module.type)}`}>
              {module.type}
            </span>
          </div>
        </div>

        {/* Version */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Version</h3>
          <p className="text-white">{module.version}</p>
        </div>

        {/* Metrics */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Total Requests</div>
              <div className="text-2xl font-bold text-white">{module.metrics.total_requests}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Successful</div>
                <div className="text-xl font-bold text-green-400">{module.metrics.successful_requests}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Failed</div>
                <div className="text-xl font-bold text-red-400">{module.metrics.failed_requests}</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Success Rate</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-white">{successRate}%</div>
                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${successRate}%` }}
                  />
                </div>
              </div>
            </div>

            {module.metrics.average_duration_ms > 0 && (
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Average Duration</div>
                <div className="text-2xl font-bold text-white">
                  {module.metrics.average_duration_ms.toFixed(2)} <span className="text-sm text-gray-400">ms</span>
                </div>
              </div>
            )}

            {module.metrics.last_request_time && (
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Last Request</div>
                <div className="text-sm text-white">
                  {new Date(module.metrics.last_request_time).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
