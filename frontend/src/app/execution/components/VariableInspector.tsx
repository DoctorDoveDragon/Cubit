'use client'

import React from 'react'

interface Variable {
  name: string;
  value: unknown;
  type: string;
}

interface VariableInspectorProps {
  variables?: Variable[];
}

export default function VariableInspector({ variables = [] }: VariableInspectorProps) {
  if (variables.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600 text-sm">
        No variables to display. Execute code to see variable states.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium">
        Variable Inspector
      </div>
      <div className="divide-y">
        {variables.map((variable, index) => (
          <div key={index} className="p-3 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-mono text-sm font-medium text-gray-900">
                  {variable.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Type: {variable.type}
                </div>
              </div>
              <div className="font-mono text-sm text-gray-700 ml-4">
                {JSON.stringify(variable.value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
