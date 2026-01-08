'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Card from '@/src/components/Card'

// Dynamic imports to avoid SSR issues
const LayoutBuilder = dynamic(() => import('./components/LayoutBuilder'), { ssr: false })
const ThemeEditor = dynamic(() => import('./components/ThemeEditor'), { ssr: false })

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Customize Your Workspace</h1>
          <p className="text-gray-600 mt-2">
            Personalize your layout and theme to match your preferences
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <ThemeEditor />
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Dashboard Layout</h2>
            <LayoutBuilder />
          </Card>
        </div>
      </div>
    </div>
  )
}
