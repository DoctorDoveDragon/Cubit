'use client'

import type { ExecutionStep } from '@/types/api'

interface VariableInspectorProps {
  steps: ExecutionStep[]
}

export default function VariableInspector({ steps }: VariableInspectorProps) {
  // Find the interpreter step which contains variables
  const interpreterStep = steps.find(step => step.module === 'interpreter' && step.status === 'completed')
  const variables = interpreterStep?.output?.variables as Record<string, unknown> || {}

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Variable Inspector</h2>
      
      {Object.keys(variables).length === 0 ? (
        <p className="text-gray-400 text-sm">No variables to display</p>
      ) : (
        <div className="space-y-2">
          {Object.entries(variables).map(([name, value]) => (
            <div key={name} className="bg-gray-800 rounded p-3">
              <div className="flex items-start justify-between">
                <div className="font-mono text-sm text-blue-400">{name}</div>
                <div className="text-xs text-gray-500">{typeof value}</div>
              </div>
              <div className="mt-1 text-sm text-gray-300 font-mono">
                {typeof value === 'object' ? (
                  <pre className="text-xs">{JSON.stringify(value, null, 2)}</pre>
                ) : (
                  String(value)
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
