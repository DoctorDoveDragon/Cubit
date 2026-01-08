'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import type { Module } from '@/types/api'

interface ModuleNodeData {
  module: Module
}

function ModuleNode({ data }: NodeProps<ModuleNodeData>) {
  const { module } = data
  
  const typeColors = {
    core: 'bg-blue-600 border-blue-500',
    pedagogical: 'bg-purple-600 border-purple-500',
    game: 'bg-green-600 border-green-500',
    api: 'bg-orange-600 border-orange-500',
  }
  
  const statusColors = {
    active: 'bg-green-500',
    error: 'bg-red-500',
    inactive: 'bg-gray-500',
  }

  return (
    <div className={`px-4 py-3 rounded-lg border-2 ${typeColors[module.type]} shadow-lg min-w-[180px]`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold text-sm text-white">{module.name}</div>
        <div className={`w-2 h-2 rounded-full ${statusColors[module.status]}`} />
      </div>
      
      <div className="text-xs text-gray-200 opacity-80">
        {module.type}
      </div>
      
      {module.metrics && module.metrics.total_requests > 0 && (
        <div className="text-xs text-gray-200 opacity-70 mt-1">
          {module.metrics.total_requests} requests
        </div>
      )}
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

export default memo(ModuleNode)
