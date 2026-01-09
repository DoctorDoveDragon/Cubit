/**
 * Advanced Code Editor Component
 * Professional code editing with Monaco Editor
 */

'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiDownload, FiCopy, FiCheck } from 'react-icons/fi'
import Editor from '@monaco-editor/react'
import { executeCode, ExecuteResponse } from '../utils/api'
import { useDeveloperMode } from '../hooks/useDeveloperMode'

const DEFAULT_CODE = `# Cubit Developer Mode
# Professional code editing environment

# Define a function
function greet(name) {
    print("Hello, " + name + "!")
}

# Call the function
greet("Developer")

# Draw some shapes
circle(100, 100, 50, "blue")
square(200, 100, 60, "green")
triangle(300, 100, 70, "red")`

export default function AdvancedCodeEditor() {
  const { preferences } = useDeveloperMode()
  const [code, setCode] = useState<string>(DEFAULT_CODE)
  const [output, setOutput] = useState<ExecuteResponse | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleExecute = useCallback(async () => {
    setIsExecuting(true)
    setOutput(null)

    try {
      const result = await executeCode({
        code,
        teaching_enabled: false,
        verbosity: 'detailed'
      })
      setOutput(result)
    } catch (error) {
      setOutput({
        output: null,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsExecuting(false)
    }
  }, [code])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cubit-code.cub'
    a.click()
    URL.revokeObjectURL(url)
  }, [code])

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2 rounded-t-lg border border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="font-mono">main.cub</span>
          <span className="text-gray-600">|</span>
          <span>{code.split('\n').length} lines</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm flex items-center gap-2 transition-colors"
            title="Copy code"
          >
            {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm flex items-center gap-2 transition-colors"
            title="Download code"
          >
            <FiDownload />
            Download
          </button>

          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-4 py-1 rounded bg-green-600 hover:bg-green-500 text-white text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlay />
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="border border-gray-700 rounded-b-lg overflow-hidden">
        <Editor
          height="500px"
          defaultLanguage="python"
          theme={preferences.editorTheme}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            fontSize: preferences.fontSize,
            minimap: { enabled: true },
            lineNumbers: 'on',
            rulers: [80, 120],
            renderWhitespace: 'selection',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            suggest: {
              enabled: preferences.enableAutocomplete,
            },
            quickSuggestions: {
              other: preferences.enableAutocomplete,
              comments: false,
              strings: false,
            },
          }}
        />
      </div>

      {/* Output Panel */}
      {output && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-lg p-4"
        >
          <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
            <span className={output.error ? 'text-red-400' : 'text-green-400'}>
              {output.error ? '●' : '●'}
            </span>
            Output
          </h3>

          {output.error ? (
            <div className="bg-red-900/20 border border-red-700 rounded p-3">
              <pre className="text-sm text-red-400 font-mono overflow-x-auto">{output.error}</pre>
            </div>
          ) : (
            <div className="space-y-2">
              {output.output && (
                <div className="bg-gray-800 border border-gray-700 rounded p-3">
                  <pre className="text-sm text-gray-300 font-mono overflow-x-auto">{output.output}</pre>
                </div>
              )}
              {output.result !== null && output.result !== undefined && (
                <div className="bg-blue-900/20 border border-blue-700 rounded p-3">
                  <p className="text-xs text-blue-400 mb-1">Result:</p>
                  <pre className="text-sm text-blue-300 font-mono overflow-x-auto">
                    {JSON.stringify(output.result, null, 2)}
                  </pre>
                </div>
              )}
              {output.shapes && output.shapes.length > 0 && (
                <div className="bg-green-900/20 border border-green-700 rounded p-3">
                  <p className="text-xs text-green-400 mb-1">Shapes rendered: {output.shapes.length}</p>
                  <div className="flex gap-2 flex-wrap">
                    {output.shapes.map((shape, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                        {shape.type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
