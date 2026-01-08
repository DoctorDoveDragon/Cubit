'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { Module } from '@/types/api'

interface ModuleNodeProps {
  data: {
    module: Module;
    onClick?: (module: Module) => void;
  };
}

function ModuleNode({ data }: ModuleNodeProps) {
  const { module, onClick } = data

  const getStatusColor = (status: Module['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'inactive':
        return 'bg-gray-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeColor = (type: Module['type']) => {
    switch (type) {
      case 'core':
        return 'border-blue-400'
      case 'pedagogical':
        return 'border-purple-400'
      case 'game':
        return 'border-yellow-400'
      case 'api':
        return 'border-green-400'
      default:
        return 'border-gray-400'
    }
  }

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${getTypeColor(module.type)} bg-gray-800 shadow-lg cursor-pointer hover:shadow-xl transition-shadow min-w-[180px]`}
      onClick={() => onClick?.(module)}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
            <span className="text-sm font-semibold text-white">{module.name}</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">{module.type}</div>
          <div className="text-xs text-gray-500">
            v{module.version}
          </div>
        </div>
      </div>

      {module.metrics && (
        <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Requests:</span>
            <span className="text-white">{module.metrics.total_requests}</span>
          </div>
          {module.metrics.average_duration_ms > 0 && (
            <div className="flex justify-between">
              <span>Avg time:</span>
              <span className="text-white">{module.metrics.average_duration_ms.toFixed(2)}ms</span>
            </div>
          )}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  )
}

export default memo(ModuleNode)
