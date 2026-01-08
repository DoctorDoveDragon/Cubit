'use client'

import React from 'react'
import { Handle, Position } from '@xyflow/react'
import type { Module } from '@/src/types/api'

interface ModuleNodeProps {
  data: {
    module: Module;
    onClick?: (module: Module) => void;
  }
}

export default function ModuleNode({ data }: ModuleNodeProps) {
  const { module, onClick } = data
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeColor = (type: string) => {
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
      className={`px-4 py-3 shadow-lg rounded-lg border-2 ${getTypeColor(module.type)} bg-white min-w-[180px] cursor-pointer hover:shadow-xl transition-shadow`}
      onClick={() => onClick?.(module)}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
        <div className="font-semibold text-sm text-gray-800">{module.name}</div>
      </div>
      
      <div className="text-xs text-gray-600">
        <div className="mb-1">Type: {module.type}</div>
        <div className="mb-1">v{module.version}</div>
        {module.metrics && (
          <div className="text-xs text-gray-500">
            Requests: {module.metrics.total_requests || 0}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}
