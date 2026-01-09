/**
 * Developer Dashboard - Main Developer Mode Interface
 * Professional developer-focused interface with advanced tools
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiCode, FiActivity, FiCpu, FiDatabase, FiBookOpen, FiPackage } from 'react-icons/fi'
import dynamic from 'next/dynamic'
import DeveloperModeToggle from '../../components/DeveloperModeToggle'
import { useDeveloperMode } from '../../hooks/useDeveloperMode'

// Dynamically import heavy components
const AdvancedCodeEditor = dynamic(() => import('../../components/AdvancedCodeEditor'), { ssr: false })

export default function DeveloperDashboard() {
  const router = useRouter()
  const { isDeveloperMode, isLoaded } = useDeveloperMode()
  const [activeTab, setActiveTab] = useState<string>('editor')

  // Redirect to learning mode if disabled
  useEffect(() => {
    if (isLoaded && !isDeveloperMode) {
      router.push('/')
    }
  }, [isDeveloperMode, isLoaded, router])

  // Don't render until preferences are loaded
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'editor', label: 'Code Editor', icon: <FiCode /> },
    { id: 'profiler', label: 'Profiler', icon: <FiActivity /> },
    { id: 'debugger', label: 'Debugger', icon: <FiCpu /> },
    { id: 'api', label: 'API Explorer', icon: <FiDatabase /> },
    { id: 'docs', label: 'Documentation', icon: <FiBookOpen /> },
    { id: 'modules', label: 'Modules', icon: <FiPackage /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCode className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-2xl font-bold text-green-400">Cubit Developer Mode</h1>
                <p className="text-sm text-gray-400">Professional Development Environment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <DeveloperModeToggle />
              <div className="text-xs text-gray-400">
                <span className="text-green-400 font-mono">●</span> Connected
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-700 bg-gray-800/30">
        <div className="px-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm
                  transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-green-400 text-green-400 bg-gray-700/50'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'editor' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiCode className="text-green-400" />
                Advanced Code Editor
              </h2>
              <p className="text-gray-400 mb-4">
                Professional code editing with syntax highlighting, autocomplete, and real-time error detection.
              </p>
              <AdvancedCodeEditor />
            </div>
          )}

          {activeTab === 'profiler' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiActivity className="text-green-400" />
                Performance Profiler
              </h2>
              <p className="text-gray-400 mb-4">
                Analyze code performance, identify bottlenecks, and optimize execution time.
              </p>
              <div className="bg-gray-900 rounded p-4 border border-gray-700">
                <p className="text-gray-500">Profiler coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'debugger' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiCpu className="text-green-400" />
                Advanced Debugger
              </h2>
              <p className="text-gray-400 mb-4">
                Step-through execution, breakpoints, and variable inspection.
              </p>
              <div className="bg-gray-900 rounded p-4 border border-gray-700">
                <p className="text-gray-500">Debugger coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiDatabase className="text-green-400" />
                API Explorer
              </h2>
              <p className="text-gray-400 mb-4">
                Explore all Cubit APIs with interactive examples and documentation.
              </p>
              <div className="bg-gray-900 rounded p-4 border border-gray-700">
                <p className="text-gray-500">API Explorer coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiBookOpen className="text-green-400" />
                Technical Documentation
              </h2>
              <p className="text-gray-400 mb-4">
                Comprehensive documentation from fundamentals to advanced topics.
              </p>
              <div className="bg-gray-900 rounded p-4 border border-gray-700">
                <p className="text-gray-500">Documentation coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiPackage className="text-green-400" />
                Module Inspector
              </h2>
              <p className="text-gray-400 mb-4">
                Explore Cubit's module architecture and dependencies.
              </p>
              <div className="bg-gray-900 rounded p-4 border border-gray-700">
                <p className="text-gray-500">Module Inspector coming soon...</p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
