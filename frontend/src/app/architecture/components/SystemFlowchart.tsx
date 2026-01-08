'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ModuleNode from './ModuleNode'
import { getModuleStatus } from '@/utils/api'
import type { Module } from '@/types/api'

const nodeTypes = {
  moduleNode: ModuleNode,
}

interface SystemFlowchartProps {
  onModuleSelect?: (module: Module) => void
}

export default function SystemFlowchart({ onModuleSelect }: SystemFlowchartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchModules = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getModuleStatus()
      
      if (!data.modules || data.modules.length === 0) {
        setError('No modules found. Please ensure the backend is running.')
        setLoading(false)
        return
      }

      // Create nodes from modules
      const moduleNodes: Node[] = []
      const moduleEdges: Edge[] = []

      // Position modules by type
      const positions = {
        core: { x: 100, y: 100 },
        pedagogical: { x: 500, y: 100 },
        game: { x: 100, y: 400 },
        api: { x: 500, y: 400 },
      }

      const counters = { core: 0, pedagogical: 0, game: 0, api: 0 }

      data.modules.forEach((module) => {
        const typePos = positions[module.type]
        const count = counters[module.type]
        
        moduleNodes.push({
          id: module.id,
          type: 'moduleNode',
          position: {
            x: typePos.x + (count % 2) * 250,
            y: typePos.y + Math.floor(count / 2) * 150,
          },
          data: {
            module,
            onClick: onModuleSelect,
          },
        })

        counters[module.type]++
      })

      // Create edges showing data flow
      // Lexer -> Parser -> Interpreter
      moduleEdges.push(
        { id: 'e-lexer-parser', source: 'lexer', target: 'parser', animated: true },
        { id: 'e-parser-interpreter', source: 'parser', target: 'interpreter', animated: true },
      )

      // Pedagogical connections
      if (data.modules.find(m => m.id === 'ped-api')) {
        moduleEdges.push(
          { id: 'e-interpreter-ped', source: 'interpreter', target: 'ped-api' },
          { id: 'e-ped-context', source: 'ped-api', target: 'context-analyzer' },
          { id: 'e-ped-skill', source: 'ped-api', target: 'skill-inference' },
          { id: 'e-ped-learning', source: 'ped-api', target: 'learning-engine' },
        )
      }

      // API connections
      if (data.modules.find(m => m.id === 'fastapi')) {
        moduleEdges.push(
          { id: 'e-api-lexer', source: 'fastapi', target: 'lexer' },
          { id: 'e-api-game', source: 'fastapi', target: 'games-executor' },
        )
      }

      setNodes(moduleNodes)
      setEdges(moduleEdges)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load module status')
    } finally {
      setLoading(false)
    }
  }, [onModuleSelect, setNodes, setEdges])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  if (loading) {
    return (
      <div className="h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-400">Loading system architecture...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchModules}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[600px] bg-gray-900 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-900"
      >
        <Background color="#374151" gap={16} />
        <Controls className="bg-gray-800 border-gray-700" />
        <MiniMap
          className="bg-gray-800 border-gray-700"
          nodeColor={(node) => {
            const module = node.data.module as Module
            switch (module.type) {
              case 'core': return '#60a5fa'
              case 'pedagogical': return '#c084fc'
              case 'game': return '#fbbf24'
              case 'api': return '#34d399'
              default: return '#9ca3af'
            }
          }}
        />
      </ReactFlow>
    </div>
  )
}
