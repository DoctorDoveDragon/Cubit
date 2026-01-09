/**
 * API Explorer Component
 * Interactive exploration of all Cubit APIs
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiPlay, FiCopy, FiCheck } from 'react-icons/fi'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { APIFunction } from '../types/developer'

const API_FUNCTIONS: APIFunction[] = [
  {
    name: 'print',
    signature: 'print(value: any) -> void',
    description: 'Outputs a value to the console',
    parameters: [
      { name: 'value', type: 'any', description: 'The value to print' }
    ],
    returnType: 'void',
    examples: [
      'print("Hello, World!")',
      'print(42)',
      'print(x + y)'
    ],
    category: 'I/O',
    complexity: 'O(1)'
  },
  {
    name: 'circle',
    signature: 'circle(x: number, y: number, radius: number, color: string) -> void',
    description: 'Draws a circle on the canvas',
    parameters: [
      { name: 'x', type: 'number', description: 'X coordinate of the center' },
      { name: 'y', type: 'number', description: 'Y coordinate of the center' },
      { name: 'radius', type: 'number', description: 'Radius of the circle' },
      { name: 'color', type: 'string', description: 'Color of the circle' }
    ],
    returnType: 'void',
    examples: [
      'circle(100, 100, 50, "red")',
      'circle(200, 150, 75, "blue")'
    ],
    category: 'Graphics',
    complexity: 'O(1)'
  },
  {
    name: 'square',
    signature: 'square(x: number, y: number, size: number, color: string) -> void',
    description: 'Draws a square on the canvas',
    parameters: [
      { name: 'x', type: 'number', description: 'X coordinate of the top-left corner' },
      { name: 'y', type: 'number', description: 'Y coordinate of the top-left corner' },
      { name: 'size', type: 'number', description: 'Size of the square' },
      { name: 'color', type: 'string', description: 'Color of the square' }
    ],
    returnType: 'void',
    examples: [
      'square(50, 50, 100, "green")',
      'square(200, 100, 80, "yellow")'
    ],
    category: 'Graphics',
    complexity: 'O(1)'
  },
  {
    name: 'range',
    signature: 'range(start: number, stop?: number, step?: number) -> list',
    description: 'Generates a sequence of numbers',
    parameters: [
      { name: 'start', type: 'number', description: 'Start value (or stop if only one arg)' },
      { name: 'stop', type: 'number', description: 'Stop value (exclusive)', optional: true },
      { name: 'step', type: 'number', description: 'Step between values', optional: true }
    ],
    returnType: 'list',
    examples: [
      'range(5)  # [0, 1, 2, 3, 4]',
      'range(2, 8)  # [2, 3, 4, 5, 6, 7]',
      'range(0, 10, 2)  # [0, 2, 4, 6, 8]'
    ],
    category: 'Utilities',
    complexity: 'O(n)'
  },
  {
    name: 'sort',
    signature: 'sort(list: list, reverse?: boolean) -> list',
    description: 'Sorts a list in ascending or descending order',
    parameters: [
      { name: 'list', type: 'list', description: 'The list to sort' },
      { name: 'reverse', type: 'boolean', description: 'If true, sort in descending order', optional: true }
    ],
    returnType: 'list',
    examples: [
      'sort([3, 1, 4, 1, 5])  # [1, 1, 3, 4, 5]',
      'sort([3, 1, 4, 1, 5], true)  # [5, 4, 3, 1, 1]'
    ],
    category: 'Utilities',
    complexity: 'O(n log n)'
  }
]

export default function APIExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedFunction, setSelectedFunction] = useState<APIFunction | null>(null)
  const [copiedExample, setCopiedExample] = useState<string | null>(null)

  const categories = ['all', ...Array.from(new Set(API_FUNCTIONS.map(f => f.category)))]

  const filteredFunctions = API_FUNCTIONS.filter(func => {
    const matchesSearch = func.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         func.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || func.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopyExample = (example: string) => {
    navigator.clipboard.writeText(example)
    setCopiedExample(example)
    setTimeout(() => setCopiedExample(null), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel - Function List */}
      <div className="lg:col-span-1 space-y-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search functions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-green-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Function List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredFunctions.map((func) => (
            <button
              key={func.name}
              onClick={() => setSelectedFunction(func)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedFunction?.name === func.name
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-mono font-bold">{func.name}</div>
              <div className="text-xs opacity-75 mt-1">{func.category} • {func.complexity}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Function Details */}
      <div className="lg:col-span-2">
        {selectedFunction ? (
          <motion.div
            key={selectedFunction.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-green-400 font-mono mb-2">
                {selectedFunction.name}
              </h2>
              <p className="text-gray-300">{selectedFunction.description}</p>
            </div>

            {/* Signature */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Signature
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <code className="text-green-300 font-mono">{selectedFunction.signature}</code>
              </div>
            </div>

            {/* Parameters */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Parameters
              </h3>
              <div className="space-y-2">
                {selectedFunction.parameters.map((param, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-blue-400">{param.name}</span>
                      <span className="text-gray-500">:</span>
                      <span className="font-mono text-purple-400">{param.type}</span>
                      {param.optional && (
                        <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-400">
                          optional
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{param.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Type */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Returns
              </h3>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <code className="text-purple-400 font-mono">{selectedFunction.returnType}</code>
              </div>
            </div>

            {/* Complexity */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Time Complexity
              </h3>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <code className="text-yellow-400 font-mono">{selectedFunction.complexity}</code>
              </div>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Examples
              </h3>
              <div className="space-y-2">
                {selectedFunction.examples.map((example, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                      <span className="text-xs text-gray-400">Example {idx + 1}</span>
                      <button
                        onClick={() => handleCopyExample(example)}
                        className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedExample === example ? (
                          <>
                            <FiCheck className="text-green-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <FiCopy />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language="python"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                      }}
                    >
                      {example}
                    </SyntaxHighlighter>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
            <FiPlay className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Select a function to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
