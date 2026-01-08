'use client'

import type { ExecutionStep } from '@/types/api'

interface CallStackViewProps {
  steps: ExecutionStep[]
}

export default function CallStackView({ steps }: CallStackViewProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Call Stack</h2>
      
      {steps.length === 0 ? (
        <p className="text-gray-400 text-sm">No execution steps</p>
      ) : (
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`p-3 rounded border-l-4 ${
                step.status === 'completed' 
                  ? 'bg-gray-800 border-green-500' 
                  : 'bg-red-950 border-red-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-mono text-sm">{step.module}</div>
                <div className="text-xs text-gray-400">#{index + 1}</div>
              </div>
              <div className="text-xs text-gray-500">
                {step.duration_ms.toFixed(2)} ms
              </div>
              {step.error && (
                <div className="text-xs text-red-400 mt-1">
                  {step.error.substring(0, 50)}...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
