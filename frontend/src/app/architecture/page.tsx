'use client'

import { useState } from 'react'
import SystemFlowchart from './components/SystemFlowchart'
import ModuleInspector from './components/ModuleInspector'
import type { Module } from '@/types/api'

export default function ArchitecturePage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Architecture</h1>
          <p className="text-gray-400">
            Interactive visualization of Cubit system modules and their relationships
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SystemFlowchart onModuleSelect={setSelectedModule} />
          </div>
          <div className="lg:col-span-1">
            <ModuleInspector module={selectedModule} />
          </div>
        </div>
      </div>
    </div>
  )
}
