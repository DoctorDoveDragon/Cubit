'use client'

import { useState } from 'react'
import ExecutionTimeline from './components/ExecutionTimeline'
import VariableInspector from './components/VariableInspector'
import CallStackView from './components/CallStackView'
import { executeDebug } from '@/utils/api'
import type { DebugExecuteResponse } from '@/types/api'

export default function ExecutionPage() {
  const [code, setCode] = useState('x = 5\ny = 10\nz = x + y\nprint(z)')
  const [debugData, setDebugData] = useState<DebugExecuteResponse | null>(null)
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
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Execution Debugger</h1>
          <p className="text-gray-400">
            Step-by-step visualization of code execution through Cubit's pipeline
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Code Editor</h2>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-32 bg-gray-800 text-white font-mono p-4 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Enter Cubit code..."
              />
              <button
                onClick={handleExecute}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded font-medium transition-colors"
              >
                {loading ? 'Executing...' : 'Execute & Debug'}
              </button>
            </div>

            <ExecutionTimeline steps={debugData?.steps || []} />
          </div>

          <div className="space-y-6">
            <VariableInspector steps={debugData?.steps || []} />
            <CallStackView steps={debugData?.steps || []} />
          </div>
        </div>

        {debugData?.final_result && (
          <div className="mt-6 bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Execution Result</h2>
            {debugData.final_result.error ? (
              <div className="text-red-400 font-mono text-sm">
                Error: {debugData.final_result.error}
              </div>
            ) : (
              <div className="space-y-2">
                {debugData.final_result.output && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Output:</div>
                    <pre className="bg-gray-800 p-3 rounded text-sm font-mono">
                      {debugData.final_result.output}
                    </pre>
                  </div>
                )}
                <div className="text-sm text-gray-400">
                  Total execution time: {debugData.total_duration_ms.toFixed(2)} ms
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
