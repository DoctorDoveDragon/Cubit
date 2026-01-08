'use client'

import { useEffect, useState, useCallback } from 'react'
import { ReactFlow, Node, Edge, Controls, Background, useNodesState, useEdgesState, ConnectionMode } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getModuleStatus } from '@/utils/api'
import type { Module } from '@/types/api'
import ModuleNode from './ModuleNode'

const nodeTypes = {
  module: ModuleNode,
}

interface SystemFlowchartProps {
  onModuleSelect?: (module: Module | null) => void
}

export default function SystemFlowchart({ onModuleSelect }: SystemFlowchartProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    async function fetchModules() {
      try {
        const data = await getModuleStatus()
        setModules(data.modules)
        
        // Create nodes from modules
        const moduleNodes: Node[] = data.modules.map((module: Module, index: number) => {
          const column = Math.floor(index / 3)
          const row = index % 3
          
          return {
            id: module.id,
            type: 'module',
            position: { x: column * 250, y: row * 150 },
            data: { module },
          }
        })
        
        // Create edges based on module flow
        const moduleEdges: Edge[] = [
          // Core flow: Lexer -> Parser -> Interpreter
          { id: 'e-lexer-parser', source: 'lexer', target: 'parser', animated: true },
          { id: 'e-parser-interpreter', source: 'parser', target: 'interpreter', animated: true },
          
          // Pedagogical connections
          { id: 'e-interpreter-ped', source: 'interpreter', target: 'ped-api' },
          { id: 'e-ped-context', source: 'ped-api', target: 'context-analyzer' },
          { id: 'e-context-skill', source: 'context-analyzer', target: 'skill-inference' },
          { id: 'e-skill-learning', source: 'skill-inference', target: 'learning-engine' },
          { id: 'e-learning-concept', source: 'learning-engine', target: 'concept-mapper' },
          { id: 'e-concept-insight', source: 'concept-mapper', target: 'insight-delivery' },
          
          // API connections
          { id: 'e-api-lexer', source: 'fastapi', target: 'lexer' },
          { id: 'e-api-games', source: 'fastapi', target: 'games-executor' },
        ].filter(edge => {
          // Only include edges where both nodes exist
          const sourceExists = moduleNodes.some(n => n.id === edge.source)
          const targetExists = moduleNodes.some(n => n.id === edge.target)
          return sourceExists && targetExists
        })
        
        setNodes(moduleNodes)
        setEdges(moduleEdges)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch module status')
        setLoading(false)
      }
    }

    fetchModules()
    const interval = setInterval(fetchModules, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [setNodes, setEdges])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const module = modules.find(m => m.id === node.id)
    if (module && onModuleSelect) {
      onModuleSelect(module)
    }
  }, [modules, onModuleSelect])

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 h-[600px] flex items-center justify-center">
        <div className="text-gray-400">Loading system architecture...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 h-[600px] flex flex-col items-center justify-center">
        <div className="text-red-400 mb-4">Failed to load architecture</div>
        <div className="text-gray-500 text-sm">{error}</div>
        <div className="text-gray-600 text-xs mt-2">
          Make sure the backend API is running
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-gray-950"
      >
        <Background color="#374151" />
        <Controls className="bg-gray-800 border-gray-700" />
      </ReactFlow>
    </div>
  )
}
