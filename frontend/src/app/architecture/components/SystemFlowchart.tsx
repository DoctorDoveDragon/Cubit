'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ModuleNode from './ModuleNode'
import type { Module } from '@/src/types/api'
import { getModuleStatus } from '@/src/utils/api'

const nodeTypes = {
  moduleNode: ModuleNode
}

interface SystemFlowchartProps {
  onModuleClick?: (module: Module) => void;
}

export default function SystemFlowchart({ onModuleClick }: SystemFlowchartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadModules = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getModuleStatus()
      
      if (!data.modules || data.modules.length === 0) {
        setError('No modules found')
        return
      }

      // Create nodes from modules
      const newNodes: Node[] = data.modules.map((module, index) => {
        const col = index % 3
        const row = Math.floor(index / 3)
        
        return {
          id: module.id,
          type: 'moduleNode',
          position: { x: col * 250 + 50, y: row * 150 + 50 },
          data: { 
            module,
            onClick: onModuleClick
          }
        }
      })

      // Create edges to show flow: lexer -> parser -> interpreter -> pedagogical modules
      const newEdges: Edge[] = []
      
      // Core flow
      newEdges.push({ id: 'e-lexer-parser', source: 'lexer', target: 'parser', animated: true })
      newEdges.push({ id: 'e-parser-interpreter', source: 'parser', target: 'interpreter', animated: true })
      
      // Pedagogical connections
      newEdges.push({ id: 'e-interpreter-ped', source: 'interpreter', target: 'ped-api' })
      newEdges.push({ id: 'e-ped-context', source: 'ped-api', target: 'context-analyzer' })
      newEdges.push({ id: 'e-ped-skill', source: 'ped-api', target: 'skill-inference' })
      newEdges.push({ id: 'e-ped-learning', source: 'ped-api', target: 'learning-engine' })
      newEdges.push({ id: 'e-ped-concept', source: 'ped-api', target: 'concept-mapper' })
      newEdges.push({ id: 'e-ped-insight', source: 'ped-api', target: 'insight-delivery' })
      
      // API and Games
      newEdges.push({ id: 'e-interpreter-api', source: 'interpreter', target: 'fastapi' })
      newEdges.push({ id: 'e-interpreter-games', source: 'interpreter', target: 'games-executor' })

      setNodes(newNodes)
      setEdges(newEdges)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load modules')
    } finally {
      setLoading(false)
    }
  }, [onModuleClick, setNodes, setEdges])

  useEffect(() => {
    loadModules()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadModules, 10000)
    return () => clearInterval(interval)
  }, [loadModules])

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-600">Loading system architecture...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error: {error}</div>
          <button
            onClick={loadModules}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[600px] bg-gray-50 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
