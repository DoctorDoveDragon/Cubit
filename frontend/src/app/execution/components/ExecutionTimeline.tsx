'use client'

import type { DebugExecutionResponse, ExecutionStep } from '@/types/api'

interface ExecutionTimelineProps {
  debugData: DebugExecutionResponse
}

export default function ExecutionTimeline({ debugData }: ExecutionTimelineProps) {
  const getStepIcon = (module: string, status: ExecutionStep['status']) => {
    if (status === 'error') {
      return (
        <div className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )
    }

    const icons = {
      lexer: '📝',
      parser: '🔍',
      interpreter: '⚡',
    }
    const icon = icons[module as keyof typeof icons] || '📦'

    return (
      <div className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-xl">
        {icon}
      </div>
    )
  }

  const getModuleColor = (module: string) => {
    const colors = {
      lexer: 'border-blue-400',
      parser: 'border-purple-400',
      interpreter: 'border-green-400',
    }
    return colors[module as keyof typeof colors] || 'border-gray-400'
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Execution Timeline</h2>
        <div className="text-sm text-gray-400">
          Total: {debugData.total_duration_ms.toFixed(2)}ms
        </div>
      </div>

      {debugData.final_result.error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <div className="font-semibold text-red-400 mb-1">Execution Error</div>
              <div className="text-sm text-red-300">{debugData.final_result.error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {debugData.steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connection line */}
            {index < debugData.steps.length - 1 && (
              <div className="absolute left-5 top-14 w-0.5 h-8 bg-gray-700" />
            )}

            <div className={`border-2 ${getModuleColor(step.module)} bg-gray-800 rounded-lg p-4`}>
              <div className="flex items-start gap-4">
                {getStepIcon(step.module, step.status)}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg capitalize">{step.module}</h3>
                      <p className="text-xs text-gray-400">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Duration:</span>{' '}
                      <span className="text-white font-mono">{step.duration_ms.toFixed(2)}ms</span>
                    </div>
                  </div>

                  {/* Step Output */}
                  <div className="mt-3 space-y-2">
                    {step.output.tokens && (
                      <div className="bg-gray-900 rounded p-3">
                        <div className="text-xs text-gray-400 mb-2">Tokens ({step.output.tokens.length})</div>
                        <div className="flex flex-wrap gap-1">
                          {step.output.tokens.slice(0, 15).map((token, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">
                              {token}
                            </span>
                          ))}
                          {step.output.tokens.length > 15 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                              +{step.output.tokens.length - 15} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {step.output.ast_summary && (
                      <div className="bg-gray-900 rounded p-3">
                        <div className="text-xs text-gray-400 mb-1">AST Summary</div>
                        <div className="text-sm font-mono text-purple-400">{step.output.ast_summary}</div>
                      </div>
                    )}

                    {step.output.stdout && (
                      <div className="bg-gray-900 rounded p-3">
                        <div className="text-xs text-gray-400 mb-1">Output</div>
                        <pre className="text-sm font-mono text-green-400">{step.output.stdout}</pre>
                      </div>
                    )}

                    {step.error && (
                      <div className="bg-red-500/10 rounded p-3 border border-red-500/50">
                        <div className="text-xs text-red-400 mb-1">Error</div>
                        <div className="text-sm text-red-300">{step.error}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Result */}
      {debugData.final_result.result !== null && !debugData.final_result.error && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Final Result</div>
          <div className="text-lg font-mono text-green-400">
            {JSON.stringify(debugData.final_result.result)}
          </div>
        </div>
      )}
    </div>
  )
}
