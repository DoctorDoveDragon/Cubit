'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Button from '../Button'
import { executeCode, ExecuteResponse } from '../../utils/api'

/**
 * Enhanced Visual Flowchart Editor with Code Generation
 * 
 * This component provides a simpler interface that explains how to use
 * the existing Flowchart component for visual programming.
 */

export default function VisualFlowchartEditor() {
  const [output, setOutput] = useState<ExecuteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [exampleCode] = useState(`# Example: Flowchart-generated code
# Use the "Cubit Coding Games" section above to access the visual flowchart editor

# Circle nodes → while loops
let counter = 0
while counter < 5 {
  print counter
  counter = counter + 1
}

# Square nodes → if/else conditionals
if counter == 5 {
  print "Reached target!"
} else {
  print "Not there yet"
}`)

  const executeExampleCode = async () => {
    setLoading(true)
    setOutput(null)

    try {
      const result = await executeCode({
        code: exampleCode,
        teaching_enabled: false
      })
      setOutput(result)
    } catch (error) {
      setOutput({
        output: null,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Visual Programming Guide</h2>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Learn how to use flowcharts for visual code creation
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-3">🎯 Powerful Simplicity</h3>
          <p className="text-sm text-purple-200 mb-4">
            The visual flowchart editor is available in the <strong>Cubit Coding Games</strong> section above!
            Scroll up to find it under the games section.
          </p>
          
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-white mb-3">Node Type Mappings:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                <span><strong>Circle</strong> → while loop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500"></div>
                <span><strong>Square</strong> → if/else conditional</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
                <span><strong>Triangle</strong> → function call</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500 rotate-45"></div>
                <span><strong>Diamond</strong> → assignment/decision</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}></div>
                <span><strong>Hexagon</strong> → variable definition</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-cyan-500" style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'}}></div>
                <span><strong>Parallelogram</strong> → input/output</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">How to Use:</h4>
            <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
              <li>Scroll up to the "Cubit Coding Games" section</li>
              <li>Look for the Flowchart/visual editor game</li>
              <li>Click "Add Node" and select a shape type</li>
              <li>Place nodes on the canvas by clicking</li>
              <li>Use "Connect" mode to link nodes with arrows</li>
              <li>Double-click nodes to add labels (conditions, variable names, etc.)</li>
              <li>Use the "Step" or "Run" buttons to visualize execution</li>
              <li>The interpreter shows you how your flowchart executes!</li>
            </ol>
          </div>
        </div>

        {/* Example Code Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Example: Flowchart-Style Code</h3>
            <Button
              variant="primary"
              onClick={executeExampleCode}
              disabled={loading}
              className="text-sm"
            >
              {loading ? 'Running...' : 'Run Example'}
            </Button>
          </div>

          <div className="bg-[var(--color-bg)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
            <pre className="text-sm font-mono text-white whitespace-pre-wrap">
              {exampleCode}
            </pre>
          </div>

          {/* Execution Output */}
          {output && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium">Output:</h4>

              {output.output && (
                <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
                  <pre className="text-sm text-white whitespace-pre-wrap font-mono">
                    {output.output}
                  </pre>
                </div>
              )}

              {output.result !== null && output.result !== undefined && (
                <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
                  <div className="text-xs text-[var(--color-muted)] mb-2">Result:</div>
                  <pre className="text-sm text-[var(--color-accent)] font-mono">
                    {JSON.stringify(output.result, null, 2)}
                  </pre>
                </div>
              )}

              {output.error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <div className="text-xs text-red-300 mb-2">Error:</div>
                  <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono">
                    {output.error}
                  </pre>
                </div>
              )}

              {!output.output && !output.result && !output.error && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 text-center">
                  <div className="text-sm text-green-300">
                    ✓ Code executed successfully
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Visual Programming Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-[var(--color-bg)] rounded-lg p-3">
            <div className="text-purple-400 font-semibold mb-2">🎨 Visual Design</div>
            <p className="text-[var(--color-muted)]">
              Drag, drop, and connect nodes to create your program visually
            </p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-lg p-3">
            <div className="text-blue-400 font-semibold mb-2">⚡ Live Execution</div>
            <p className="text-[var(--color-muted)]">
              Step through your flowchart and watch it execute in real-time
            </p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-lg p-3">
            <div className="text-green-400 font-semibold mb-2">🎯 Learn by Doing</div>
            <p className="text-[var(--color-muted)]">
              Perfect for understanding control flow and program logic
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
