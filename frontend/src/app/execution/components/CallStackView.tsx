'use client'

import type { DebugExecutionResponse } from '@/types/api'

interface CallStackViewProps {
  debugData: DebugExecutionResponse
}

export default function CallStackView({ debugData }: CallStackViewProps) {
  // Build call stack from execution steps
  const callStack = debugData.steps
    .filter(step => step.status === 'completed')
    .map((step, index) => ({
      frame: index,
      module: step.module,
      timestamp: step.timestamp,
      duration: step.duration_ms,
    }))

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Call Stack</h2>

      {callStack.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          <p className="text-sm">No call stack available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {callStack.map((frame) => (
            <div
              key={frame.frame}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                    {frame.frame}
                  </span>
                  <span className="font-mono font-semibold text-white capitalize">
                    {frame.module}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {frame.duration.toFixed(2)}ms
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-8">
                {new Date(frame.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {callStack.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Frames</span>
            <span className="font-semibold text-white">{callStack.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-400">Total Duration</span>
            <span className="font-semibold text-white">
              {debugData.total_duration_ms.toFixed(2)}ms
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
