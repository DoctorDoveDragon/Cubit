'use client'

import React, { useState, useEffect } from 'react'
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface LayoutBuilderProps {
  onLayoutChange?: (layout: Layout[]) => void;
}

export default function LayoutBuilder({ onLayoutChange }: LayoutBuilderProps) {
  const [layouts, setLayouts] = useState<{ lg: Layout[] }>({
    lg: [
      { i: 'code-editor', x: 0, y: 0, w: 6, h: 4, minW: 2, minH: 2 },
      { i: 'output-panel', x: 6, y: 0, w: 6, h: 4, minW: 2, minH: 2 },
      { i: 'module-status', x: 0, y: 4, w: 4, h: 3, minW: 2, minH: 2 },
      { i: 'learning-progress', x: 4, y: 4, w: 4, h: 3, minW: 2, minH: 2 },
      { i: 'logs', x: 8, y: 4, w: 4, h: 3, minW: 2, minH: 2 }
    ]
  })

  // Load saved layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('cubit-dashboard-layout')
    if (savedLayout) {
      try {
        setLayouts(JSON.parse(savedLayout))
      } catch (error) {
        console.error('Failed to load saved layout:', error)
      }
    }
  }, [])

  const handleLayoutChange = (layout: Layout[], allLayouts: { lg: Layout[] }) => {
    setLayouts(allLayouts)
    localStorage.setItem('cubit-dashboard-layout', JSON.stringify(allLayouts))
    onLayoutChange?.(layout)
  }

  const handleResetLayout = () => {
    const defaultLayout = {
      lg: [
        { i: 'code-editor', x: 0, y: 0, w: 6, h: 4, minW: 2, minH: 2 },
        { i: 'output-panel', x: 6, y: 0, w: 6, h: 4, minW: 2, minH: 2 },
        { i: 'module-status', x: 0, y: 4, w: 4, h: 3, minW: 2, minH: 2 },
        { i: 'learning-progress', x: 4, y: 4, w: 4, h: 3, minW: 2, minH: 2 },
        { i: 'logs', x: 8, y: 4, w: 4, h: 3, minW: 2, minH: 2 }
      ]
    }
    setLayouts(defaultLayout)
    localStorage.setItem('cubit-dashboard-layout', JSON.stringify(defaultLayout))
  }

  const renderPanel = (id: string, title: string, color: string) => (
    <div className={`${color} rounded-lg shadow-lg p-4 overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="text-xs text-gray-500">Drag to move • Resize</div>
      </div>
      <div className="h-full bg-white bg-opacity-50 rounded p-2 text-sm text-gray-600">
        {id === 'code-editor' && 'Code editor would appear here'}
        {id === 'output-panel' && 'Execution output would appear here'}
        {id === 'module-status' && 'Module health status would appear here'}
        {id === 'learning-progress' && 'Learning progress would appear here'}
        {id === 'logs' && 'System logs would appear here'}
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Drag panels to rearrange and resize them. Your layout will be saved automatically.
        </p>
        <button
          onClick={handleResetLayout}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          Reset Layout
        </button>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
      >
        <div key="code-editor" className="drag-handle">
          {renderPanel('code-editor', 'Code Editor', 'bg-blue-100')}
        </div>
        <div key="output-panel" className="drag-handle">
          {renderPanel('output-panel', 'Output Panel', 'bg-green-100')}
        </div>
        <div key="module-status" className="drag-handle">
          {renderPanel('module-status', 'Module Status', 'bg-purple-100')}
        </div>
        <div key="learning-progress" className="drag-handle">
          {renderPanel('learning-progress', 'Learning Progress', 'bg-yellow-100')}
        </div>
        <div key="logs" className="drag-handle">
          {renderPanel('logs', 'System Logs', 'bg-gray-100')}
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}
