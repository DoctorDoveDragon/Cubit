'use client'

import type { Module } from '@/types/api'

interface ModuleInspectorProps {
  module: Module | null
}

export default function ModuleInspector({ module }: ModuleInspectorProps) {
  if (!module) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 h-[600px]">
        <h2 className="text-xl font-bold mb-4">Module Inspector</h2>
        <p className="text-gray-400">Click on a module to view details</p>
      </div>
    )
  }

  const typeColors = {
    core: 'text-blue-400',
    pedagogical: 'text-purple-400',
    game: 'text-green-400',
    api: 'text-orange-400',
  }

  const statusColors = {
    active: 'text-green-400',
    error: 'text-red-400',
    inactive: 'text-gray-400',
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-[600px] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Module Inspector</h2>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Name</div>
          <div className="text-lg font-semibold">{module.name}</div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-1">ID</div>
          <div className="text-sm font-mono">{module.id}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Type</div>
            <div className={`text-sm font-medium ${typeColors[module.type]}`}>
              {module.type}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-1">Status</div>
            <div className={`text-sm font-medium ${statusColors[module.status]}`}>
              {module.status}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-1">Version</div>
          <div className="text-sm font-mono">{module.version}</div>
        </div>

        {module.metrics && (
          <div className="border-t border-gray-800 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-3">Metrics</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Total Requests</span>
                <span className="text-sm font-mono">{module.metrics.total_requests}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Successful</span>
                <span className="text-sm font-mono text-green-400">
                  {module.metrics.successful_requests}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Failed</span>
                <span className="text-sm font-mono text-red-400">
                  {module.metrics.failed_requests}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Avg Response Time</span>
                <span className="text-sm font-mono">
                  {module.metrics.avg_response_time_ms.toFixed(2)} ms
                </span>
              </div>

              {module.metrics.last_request_time && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Last Request</span>
                  <span className="text-sm font-mono">
                    {new Date(module.metrics.last_request_time).toLocaleTimeString()}
                  </span>
                </div>
              )}

              {module.metrics.total_requests > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">Success Rate</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(module.metrics.successful_requests / module.metrics.total_requests) * 100}%`
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((module.metrics.successful_requests / module.metrics.total_requests) * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
