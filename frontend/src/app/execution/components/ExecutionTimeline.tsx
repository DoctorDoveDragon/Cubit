'use client'

import React, { useState } from 'react'
import { executeDebug } from '@/src/utils/api'
import Button from '@/src/components/Button'

interface DebugStep {
  id: string;
  module: string;
  timestamp: string;
  duration_ms: number;
  input: string | Record<string, unknown>;
  output: Record<string, unknown>;
  status: string;
  error?: string;
}

export default function ExecutionTimeline() {
  const [code, setCode] = useState('x = 5\ny = 10\nprint(x + y)')
  const [steps, setSteps] = useState<DebugStep[]>([])
  const [result, setResult] = useState<{
    output: string | null;
    error: string | null;
    skill_level: string;
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleExecute = async () => {
    setLoading(true)
    try {
      const data = await executeDebug({
        code,
        teaching_enabled: true,
        verbosity: 'detailed'
      })
      
      setSteps(data.steps)
      setResult(data.result)
    } catch (error) {
      console.error('Execution failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'lexer': return 'bg-blue-100 text-blue-800'
      case 'parser': return 'bg-purple-100 text-purple-800'
      case 'interpreter': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Code to Debug:</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border rounded-lg font-mono text-sm"
          rows={6}
          placeholder="Enter Cubit code..."
        />
      </div>

      <Button
        onClick={handleExecute}
        disabled={loading || !code.trim()}
        variant="primary"
        className="mb-6"
      >
        {loading ? 'Executing...' : 'Execute with Debug'}
      </Button>

      {steps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Execution Steps</h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />
            
            {steps.map((step, index) => (
              <div key={step.id} className="relative pl-16 pb-8">
                {/* Timeline dot */}
                <div className={`absolute left-6 w-4 h-4 rounded-full ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                } border-4 border-white`} />
                
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getModuleColor(step.module)}`}>
                      {step.module}
                    </span>
                    <span className="text-xs text-gray-500">
                      {step.duration_ms.toFixed(2)}ms
                    </span>
                    <span className={`text-xs ${step.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                      {step.status}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    {step.output && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-600 mb-1">Output:</div>
                        <div className="bg-gray-50 p-2 rounded font-mono text-xs">
                          {typeof step.output === 'object' 
                            ? JSON.stringify(step.output, null, 2)
                            : String(step.output)}
                        </div>
                      </div>
                    )}
                    
                    {step.error && (
                      <div className="mt-2 text-red-600 text-xs">
                        Error: {step.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Final Result</h4>
              {result.output && (
                <div className="mb-2">
                  <div className="text-xs text-gray-600">Output:</div>
                  <div className="font-mono text-sm">{result.output}</div>
                </div>
              )}
              {result.error && (
                <div className="text-red-600 text-sm">{result.error}</div>
              )}
              <div className="text-xs text-gray-600 mt-2">
                Skill Level: <span className="font-medium">{result.skill_level}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
