'use client'

import type { ExecutionStep } from '@/types/api'

interface ExecutionTimelineProps {
  steps: ExecutionStep[]
}

export default function ExecutionTimeline({ steps }: ExecutionTimelineProps) {
  if (steps.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Execution Timeline</h2>
        <p className="text-gray-400">Execute code to see the step-by-step timeline</p>
      </div>
    )
  }

  const moduleColors: Record<string, string> = {
    lexer: 'bg-blue-600',
    parser: 'bg-purple-600',
    interpreter: 'bg-green-600',
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Execution Timeline</h2>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {index < steps.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-700" />
            )}
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full ${moduleColors[step.module] || 'bg-gray-600'} flex items-center justify-center font-bold text-sm`}>
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold capitalize">{step.module}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      step.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {step.status}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2">
                    Duration: {step.duration_ms.toFixed(2)} ms
                  </div>
                  
                  {step.error && (
                    <div className="text-sm text-red-400 mt-2 bg-red-950 p-2 rounded">
                      {step.error}
                    </div>
                  )}
                  
                  {step.status === 'completed' && step.output && (
                    <details className="mt-2">
                      <summary className="text-sm text-blue-400 cursor-pointer hover:text-blue-300">
                        View Output
                      </summary>
                      <div className="mt-2 bg-gray-950 p-3 rounded text-xs font-mono overflow-x-auto">
                        {typeof step.output === 'object' ? (
                          <pre>{JSON.stringify(step.output, null, 2)}</pre>
                        ) : (
                          <div>{String(step.output)}</div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
