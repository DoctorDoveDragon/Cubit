'use client'

import React, { useState } from 'react'
import Button from './Button'
import { executeCode, ExecuteResponse } from '../utils/api'
import { CUBIT_EXAMPLES, getExamplesList } from '../constants/examples'

export default function CodeExecutor() {
  const [code, setCode] = useState<string>(CUBIT_EXAMPLES.hello.code)
  const [output, setOutput] = useState<ExecuteResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedExample, setSelectedExample] = useState<string>('hello')

  const handleRunCode = async () => {
    setLoading(true)
    setOutput(null)
    
    try {
      const result = await executeCode(code)
      setOutput(result)
    } catch (error) {
      setOutput({
        output: null,
        result: null,
        error: error instanceof Error ? error.message : 'Failed to execute code'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLoadExample = (exampleKey: string) => {
    const example = CUBIT_EXAMPLES[exampleKey]
    if (example) {
      setCode(example.code)
      setSelectedExample(exampleKey)
      setOutput(null)
    }
  }

  const examples = getExamplesList()

  return (
    <div className="space-y-4">
      {/* Example Snippets Dropdown */}
      <div className="flex items-center gap-3">
        <label htmlFor="examples" className="text-sm font-medium">
          Load Example:
        </label>
        <select
          id="examples"
          value={selectedExample}
          onChange={(e) => handleLoadExample(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] text-white text-sm focus:outline-none focus:border-[var(--color-accent)]"
        >
          {examples.map((example, idx) => (
            <option key={idx} value={Object.keys(CUBIT_EXAMPLES)[idx]}>
              {example.name} - {example.description}
            </option>
          ))}
        </select>
      </div>

      {/* Code Editor */}
      <div>
        <label htmlFor="code-editor" className="block text-sm font-medium mb-2">
          Cubit Code:
        </label>
        <textarea
          id="code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] text-white font-mono text-sm resize-y focus:outline-none focus:border-[var(--color-accent)]"
          placeholder="Enter your Cubit code here..."
          spellCheck={false}
        />
      </div>

      {/* Run Button */}
      <div>
        <Button
          variant="primary"
          onClick={handleRunCode}
          disabled={loading || !code.trim()}
          className="w-full sm:w-auto"
        >
          {loading ? 'Running...' : 'Run Code'}
        </Button>
      </div>

      {/* Output Display */}
      {output && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Output:</h4>
          
          {/* Standard Output */}
          {output.output && (
            <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-muted)] mb-2">Standard Output:</div>
              <pre className="text-sm text-white whitespace-pre-wrap font-mono">
                {output.output}
              </pre>
            </div>
          )}
          
          {/* Result Value */}
          {output.result !== null && output.result !== undefined && (
            <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-muted)] mb-2">Result:</div>
              <pre className="text-sm text-[var(--color-accent)] font-mono">
                {JSON.stringify(output.result, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Error Messages */}
          {output.error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <div className="text-xs text-red-300 mb-2">Error:</div>
              <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono">
                {output.error}
              </pre>
            </div>
          )}

          {/* No output message */}
          {!output.output && !output.result && !output.error && (
            <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4 text-center text-[var(--color-muted)]">
              Code executed successfully with no output
            </div>
          )}
        </div>
      )}
    </div>
  )
}
