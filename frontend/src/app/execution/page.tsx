'use client'

import { useState } from 'react'
import ExecutionTimeline from './components/ExecutionTimeline'
import VariableInspector from './components/VariableInspector'
import CallStackView from './components/CallStackView'
import { executeDebug } from '@/utils/api'
import type { DebugExecutionResponse } from '@/types/api'

export default function ExecutionPage() {
  const [code, setCode] = useState('x = 10\ny = 20\nresult = x + y\nprint(result)')
  const [debugData, setDebugData] = useState<DebugExecutionResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleExecute = async () => {
    setLoading(true)
    try {
      const result = await executeDebug({ code, teaching_enabled: true })
      setDebugData(result)
    } catch (error) {
      console.error('Execution failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Execution Debugger</h1>
          <p className="text-gray-400">
            Step-by-step visualization of code execution through the Cubit system
          </p>
        </div>

        {/* Code Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Cubit Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Cubit code to debug..."
          />
          <button
            onClick={handleExecute}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            {loading ? 'Executing...' : 'Execute & Debug'}
          </button>
        </div>

        {/* Debug Visualization */}
        {debugData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ExecutionTimeline debugData={debugData} />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <VariableInspector debugData={debugData} />
              <CallStackView debugData={debugData} />
            </div>
          </div>
        )}

        {!debugData && !loading && (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400">Execute code to see debug visualization</p>
          </div>
        )}
      </div>
    </div>
  )
}
