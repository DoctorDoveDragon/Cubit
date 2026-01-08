'use client'

import type { DebugExecutionResponse } from '@/types/api'

interface VariableInspectorProps {
  debugData: DebugExecutionResponse
}

export default function VariableInspector({ debugData }: VariableInspectorProps) {
  // Extract variables from the interpreter step
  const interpreterStep = debugData.steps.find(step => step.module === 'interpreter')
  const variables = interpreterStep?.output.variables || {}

  const formatValue = (value: unknown): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  const getValueType = (value: unknown): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (Array.isArray(value)) return 'array'
    return typeof value
  }

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      number: 'text-blue-400',
      string: 'text-green-400',
      boolean: 'text-purple-400',
      object: 'text-yellow-400',
      array: 'text-orange-400',
      null: 'text-gray-400',
      undefined: 'text-gray-400',
    }
    return colors[type] || 'text-white'
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Variables</h2>

      {Object.keys(variables).length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm">No variables defined</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(variables).map(([name, value]) => {
            const type = getValueType(value)
            const typeColor = getTypeColor(type)
            
            return (
              <div key={name} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-semibold text-white">{name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${typeColor} bg-gray-700`}>
                    {type}
                  </span>
                </div>
                <div className={`font-mono text-sm ${typeColor}`}>
                  {formatValue(value)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
