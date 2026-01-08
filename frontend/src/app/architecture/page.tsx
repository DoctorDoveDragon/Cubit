'use client'

import { useEffect, useState } from 'react'
import SystemFlowchart from './components/SystemFlowchart'
import ModuleInspector from './components/ModuleInspector'
import type { Module } from '@/types/api'

export default function ArchitecturePage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Architecture</h1>
          <p className="text-gray-400">
            Visualize Cubit's modular architecture and data flow
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SystemFlowchart onModuleSelect={setSelectedModule} />
          </div>
          
          <div>
            <ModuleInspector module={selectedModule} />
          </div>
        </div>
      </div>
    </div>
  )
}
