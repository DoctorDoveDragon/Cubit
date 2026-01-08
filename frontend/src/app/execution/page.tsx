'use client'

import React from 'react'
import Card from '@/src/components/Card'
import ExecutionTimeline from './components/ExecutionTimeline'
import VariableInspector from './components/VariableInspector'
import CallStackView from './components/CallStackView'

export default function ExecutionPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Code Execution Debug</h1>
          <p className="text-gray-600 mt-2">
            Step-by-step visualization of code execution through the Cubit pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <ExecutionTimeline />
            </Card>
          </div>

          <div className="space-y-6">
            <VariableInspector />
            <CallStackView />
          </div>
        </div>
      </div>
    </div>
  )
}
