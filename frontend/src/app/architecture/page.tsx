'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@/src/components/Card'
import type { Module } from '@/src/types/api'

// Dynamic import to avoid SSR issues with ReactFlow
const SystemFlowchart = dynamic(() => import('./components/SystemFlowchart'), { ssr: false })
const ModuleInspector = dynamic(() => import('./components/ModuleInspector'), { ssr: false })

export default function ArchitecturePage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">System Architecture</h1>
          <p className="text-gray-600 mt-2">
            Visual representation of Cubit system modules and their interactions
          </p>
        </div>

        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Module Flowchart</h2>
            <p className="text-sm text-gray-600">
              Click on a module to view detailed metrics and information
            </p>
          </div>
          <SystemFlowchart onModuleClick={setSelectedModule} />
        </Card>

        {selectedModule && (
          <ModuleInspector
            module={selectedModule}
            onClose={() => setSelectedModule(null)}
          />
        )}
      </div>
    </div>
  )
}
