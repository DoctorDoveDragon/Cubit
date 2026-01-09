/**
 * Module Inspector Component
 * Explore Cubit's module architecture and dependencies
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiRefreshCw, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi'
import { getModuleStatus } from '../utils/api'
import type { ModuleStatus } from '../types/api'
import type { ModuleInfo } from '../types/developer'

// Sample module data (would come from backend in production)
const SAMPLE_MODULES: ModuleInfo[] = [
  {
    name: 'core',
    version: '1.0.0',
    description: 'Core language runtime and interpreter',
    dependencies: [],
    exports: ['Interpreter', 'Environment', 'Evaluator'],
    path: '/cubit/core',
    size: 45000
  },
  {
    name: 'graphics',
    version: '1.2.0',
    description: 'Visual rendering and canvas operations',
    dependencies: ['core'],
    exports: ['circle', 'square', 'triangle', 'line', 'Canvas'],
    path: '/cubit/graphics',
    size: 28000
  },
  {
    name: 'math',
    version: '1.1.0',
    description: 'Mathematical operations and utilities',
    dependencies: ['core'],
    exports: ['sin', 'cos', 'sqrt', 'abs', 'pow', 'random'],
    path: '/cubit/math',
    size: 12000
  },
  {
    name: 'io',
    version: '1.0.1',
    description: 'Input/output operations',
    dependencies: ['core'],
    exports: ['print', 'input', 'read_file', 'write_file'],
    path: '/cubit/io',
    size: 8000
  },
  {
    name: 'collections',
    version: '1.0.0',
    description: 'Data structures and collection utilities',
    dependencies: ['core'],
    exports: ['List', 'Dict', 'Set', 'sort', 'filter', 'map'],
    path: '/cubit/collections',
    size: 18000
  }
]

export default function ModuleInspector() {
  const [modules] = useState<ModuleInfo[]>(SAMPLE_MODULES)
  const [moduleStatus, setModuleStatus] = useState<ModuleStatus[]>([])
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)

  const loadModuleStatus = async () => {
    setIsLoading(true)
    setUsingFallback(false)
    try {
      const status = await getModuleStatus()
      setModuleStatus(status)
    } catch (error) {
      console.error('Failed to load module status:', error)
      // Use sample data if backend fails
      setUsingFallback(true)
      setModuleStatus([
        { name: 'core', status: 'active', version: '1.0.0' },
        { name: 'graphics', status: 'active', version: '1.2.0' },
        { name: 'math', status: 'active', version: '1.1.0' },
        { name: 'io', status: 'active', version: '1.0.1' },
        { name: 'collections', status: 'active', version: '1.0.0' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadModuleStatus()
  }, [])

  const getStatusIcon = (moduleName: string) => {
    const status = moduleStatus.find(s => s.name === moduleName)
    if (!status) return <FiAlertCircle className="text-gray-500" />
    
    switch (status.status) {
      case 'active':
        return <FiCheck className="text-green-400" />
      case 'error':
        return <FiX className="text-red-400" />
      default:
        return <FiAlertCircle className="text-yellow-400" />
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Module List */}
      <div className="lg:col-span-1 space-y-4">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-200">Modules</h3>
            {usingFallback && (
              <span className="text-xs px-2 py-1 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-400">
                Demo Data
              </span>
            )}
          </div>
          <button
            onClick={loadModuleStatus}
            disabled={isLoading}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors disabled:opacity-50"
            title="Refresh module status"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Module List */}
        <div className="space-y-2">
          {modules.map((module) => (
            <button
              key={module.name}
              onClick={() => setSelectedModule(module)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedModule?.name === module.name
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(module.name)}
                  <span className="font-bold font-mono">{module.name}</span>
                </div>
                <span className="text-xs opacity-75">v{module.version}</span>
              </div>
              <p className="text-xs opacity-75 truncate">{module.description}</p>
            </button>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <h4 className="text-sm font-bold text-gray-400 mb-3">Statistics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Modules:</span>
              <span className="text-gray-200 font-bold">{modules.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active:</span>
              <span className="text-green-400 font-bold">
                {moduleStatus.filter(s => s.status === 'active').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Size:</span>
              <span className="text-gray-200 font-bold">
                {formatSize(modules.reduce((sum, m) => sum + m.size, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Module Details */}
      <div className="lg:col-span-2">
        {selectedModule ? (
          <motion.div
            key={selectedModule.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FiPackage className="w-8 h-8 text-green-400" />
                <div>
                  <h2 className="text-2xl font-bold text-green-400 font-mono">
                    {selectedModule.name}
                  </h2>
                  <p className="text-sm text-gray-400">v{selectedModule.version}</p>
                </div>
              </div>
              <p className="text-gray-300">{selectedModule.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Path</p>
                <p className="font-mono text-sm text-gray-200">{selectedModule.path}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Size</p>
                <p className="font-mono text-sm text-gray-200">{formatSize(selectedModule.size)}</p>
              </div>
            </div>

            {/* Dependencies */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Dependencies
              </h3>
              {selectedModule.dependencies.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {selectedModule.dependencies.map((dep) => (
                    <button
                      key={dep}
                      onClick={() => {
                        const depModule = modules.find(m => m.name === dep)
                        if (depModule) setSelectedModule(depModule)
                      }}
                      className="px-3 py-1 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-300 text-sm hover:bg-blue-900/50 transition-colors"
                    >
                      {dep}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No dependencies</p>
              )}
            </div>

            {/* Exports */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Exports ({selectedModule.exports.length})
              </h3>
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedModule.exports.map((exp) => (
                    <div
                      key={exp}
                      className="px-3 py-2 bg-gray-800 rounded text-green-300 font-mono text-sm"
                    >
                      {exp}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dependency Graph */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Module Loading Lifecycle
              </h3>
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium">Import Resolution</p>
                    <p className="text-xs text-gray-400">Locate module in filesystem</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium">Dependency Loading</p>
                    <p className="text-xs text-gray-400">Load required dependencies first</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium">Module Initialization</p>
                    <p className="text-xs text-gray-400">Execute module code and setup exports</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium">Export Registration</p>
                    <p className="text-xs text-gray-400">Register module exports in global namespace</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center h-full flex items-center justify-center">
            <div>
              <FiPackage className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a module to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
