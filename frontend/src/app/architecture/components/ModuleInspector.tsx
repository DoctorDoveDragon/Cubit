'use client'

import React from 'react'
import type { Module } from '@/src/types/api'
import Card from '@/src/components/Card'

interface ModuleInspectorProps {
  module: Module | null;
  onClose: () => void;
}

export default function ModuleInspector({ module, onClose }: ModuleInspectorProps) {
  if (!module) return null

  return (
    <Card className="mt-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{module.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
          aria-label="Close inspector"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">ID:</div>
          <div className="font-mono">{module.id}</div>
          
          <div className="text-gray-600">Type:</div>
          <div className="capitalize">{module.type}</div>
          
          <div className="text-gray-600">Status:</div>
          <div className={module.status === 'active' ? 'text-green-600' : 'text-red-600'}>
            {module.status}
          </div>
          
          <div className="text-gray-600">Version:</div>
          <div>{module.version}</div>
        </div>
        
        {module.metrics && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Total Requests:</div>
              <div>{module.metrics.total_requests}</div>
              
              <div className="text-gray-600">Successful:</div>
              <div className="text-green-600">{module.metrics.successful_requests}</div>
              
              <div className="text-gray-600">Failed:</div>
              <div className="text-red-600">{module.metrics.failed_requests}</div>
              
              <div className="text-gray-600">Avg Response:</div>
              <div>{module.metrics.average_response_time_ms.toFixed(2)}ms</div>
              
              {module.metrics.last_request_time && (
                <>
                  <div className="text-gray-600">Last Request:</div>
                  <div className="text-xs">
                    {new Date(module.metrics.last_request_time).toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
