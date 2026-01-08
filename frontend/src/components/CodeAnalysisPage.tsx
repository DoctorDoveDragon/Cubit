'use client'

import React, { useState } from 'react'
import CodeAnalysis from './CodeAnalysis'
import EnhancedCodeEditor from './EnhancedCodeEditor'
import Button from './Button'

/**
 * Code Analysis Tab Page
 * Dedicated page for code analysis and metrics
 */
export default function CodeAnalysisPage() {
  const [code, setCode] = useState(`# Enter your Cubit code here for analysis
let counter = 0
while counter < 10 {
  if counter % 2 == 0 {
    print counter
  }
  counter = counter + 1
}`)

  const [showExamples, setShowExamples] = useState(false)

  const examples = {
    simple: `# Simple code
let x = 5
print x`,
    moderate: `# Moderate complexity
let counter = 0
while counter < 10 {
  print counter
  counter = counter + 1
}`,
    complex: `# Complex code with nested structures
let i = 0
while i < 5 {
  let j = 0
  while j < 3 {
    if i > j {
      print "i is greater"
    } else {
      print "j is greater or equal"
    }
    j = j + 1
  }
  i = i + 1
}`
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Code Analysis</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Analyze your code for complexity, structure, and get improvement suggestions
        </p>
      </div>

      {/* Code Input */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Code to Analyze</h3>
          <Button
            variant="secondary"
            onClick={() => setShowExamples(!showExamples)}
            className="text-sm"
          >
            {showExamples ? 'Hide' : 'Show'} Examples
          </Button>
        </div>

        {showExamples && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              onClick={() => setCode(examples.simple)}
              className="text-xs"
            >
              Simple Example
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCode(examples.moderate)}
              className="text-xs"
            >
              Moderate Example
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCode(examples.complex)}
              className="text-xs"
            >
              Complex Example
            </Button>
          </div>
        )}

        <EnhancedCodeEditor
          value={code}
          onChange={setCode}
          language="cubit"
          showLineNumbers={true}
        />
      </div>

      {/* Analysis Results */}
      <CodeAnalysis code={code} />

      {/* Analysis Guide */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">📊 Understanding Code Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--color-muted)]">
          <div>
            <h4 className="font-medium text-white mb-2">Complexity Levels</h4>
            <ul className="space-y-1">
              <li>• <strong className="text-green-400">Simple (1-5)</strong>: Easy to understand and maintain</li>
              <li>• <strong className="text-yellow-400">Moderate (6-10)</strong>: Acceptable complexity</li>
              <li>• <strong className="text-orange-400">Complex (11-20)</strong>: Consider refactoring</li>
              <li>• <strong className="text-red-400">Very Complex (20+)</strong>: Difficult to maintain</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">What We Analyze</h4>
            <ul className="space-y-1">
              <li>• Cyclomatic complexity calculation</li>
              <li>• Variable usage and declarations</li>
              <li>• Control structures (loops, conditions)</li>
              <li>• Code organization and nesting depth</li>
              <li>• Maintainability indicators</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
