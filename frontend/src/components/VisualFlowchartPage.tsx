'use client'

import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import FlowchartToCodeConverter from './FlowchartToCodeConverter'

// Dynamically import Flowchart to avoid SSR issues
const Flowchart = dynamic(() => import('./games/Flowchart'), { ssr: false })

interface FlowchartNode {
  id: number
  x: number
  y: number
  type: 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'parallelogram'
  label?: string
  meta?: {
    role?: string
    group?: string
    inputs?: string[]
    outputs?: string[]
  }
}

interface FlowchartEdge {
  from: number
  to: number
  label?: string
}

/**
 * Visual Flowchart Page with integrated code generation
 * This provides the full flowchart-to-code conversion experience
 */
export default function VisualFlowchartPage() {
  const [nodes, setNodes] = useState<FlowchartNode[]>([])
  const [edges, setEdges] = useState<FlowchartEdge[]>([])
  const [autoGenerate, setAutoGenerate] = useState(false)

  // These would be passed to a modified Flowchart component
  // For now, we'll work with the existing Flowchart that manages its own state
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Visual Flowchart Editor</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Create flowcharts visually and automatically convert them to executable Cubit code
        </p>
        
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Auto-generate code on changes</span>
          </label>
        </div>
      </div>

      {/* Node Type Reference */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">🎯 Node Type Mappings</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500"></div>
            <span><strong>Circle</strong> → while loop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500"></div>
            <span><strong>Square</strong> → if/else</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
            <span><strong>Triangle</strong> → function</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rotate-45"></div>
            <span><strong>Diamond</strong> → assignment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}></div>
            <span><strong>Hexagon</strong> → variable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-cyan-500" style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'}}></div>
            <span><strong>Parallelogram</strong> → I/O</span>
          </div>
        </div>
      </div>

      {/* Flowchart Canvas */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Flowchart Canvas</h3>
        <Flowchart />
      </div>

      {/* Code Converter */}
      {/* Note: Currently displays placeholder until Flowchart component is refactored to expose state */}
      <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-yellow-300 mb-2">⚠️ Integration Status</h4>
        <p className="text-sm text-yellow-200">
          The Flowchart component currently manages its own state internally. Full integration requires
          refactoring the Flowchart component to expose nodes and edges via callbacks. 
          The code converter algorithm is ready - it just needs access to the flowchart data.
        </p>
      </div>

      <FlowchartToCodeConverter 
        nodes={nodes} 
        edges={edges} 
        autoGenerate={autoGenerate}
      />

      {/* Instructions */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">📖 How to Use</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--color-muted)]">
          <div>
            <h4 className="font-medium text-white mb-2">Creating Your Flowchart</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Add Node" and select a shape type</li>
              <li>Click on the canvas to place nodes</li>
              <li>Switch to "Connect" mode to link nodes</li>
              <li>Double-click nodes to edit labels</li>
              <li>Label edges (especially for conditionals)</li>
              <li>Click "Generate Code" to convert to Cubit</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Best Practices</h4>
            <ul className="space-y-1">
              <li>• Start with simple linear flows first</li>
              <li>• Use clear, descriptive labels</li>
              <li>• Label conditional edges as "true"/"false"</li>
              <li>• Test generated code incrementally</li>
              <li>• Use the interpreter to visualize execution</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
