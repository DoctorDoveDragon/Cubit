'use client'

import React, { useState, useMemo } from 'react'
import Button from './Button'

interface CodeAnalysisProps {
  code: string
}

interface AnalysisResult {
  lines: number
  nonEmptyLines: number
  comments: number
  functions: number
  loops: number
  conditionals: number
  variables: Set<string>
  complexity: number
  suggestions: string[]
}

/**
 * Real Code Analysis Component
 * Provides actual analysis of Cubit code instead of simulated results
 */
export default function CodeAnalysis({ code }: CodeAnalysisProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Perform real code analysis
  const analysis = useMemo((): AnalysisResult => {
    if (!code.trim()) {
      return {
        lines: 0,
        nonEmptyLines: 0,
        comments: 0,
        functions: 0,
        loops: 0,
        conditionals: 0,
        variables: new Set(),
        complexity: 0,
        suggestions: []
      }
    }

    const lines = code.split('\n')
    const nonEmptyLines = lines.filter(line => line.trim().length > 0).length
    const comments = lines.filter(line => line.trim().startsWith('#')).length

    // Count control structures
    const loops = (code.match(/\bwhile\b/g) || []).length
    const conditionals = (code.match(/\bif\b/g) || []).length

    // Extract variable names (simplified - looks for 'let varname =')
    const varMatches = code.matchAll(/\blet\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g)
    const variables = new Set<string>()
    for (const match of varMatches) {
      variables.add(match[1])
    }

    // Count function calls (simplified)
    const functions = (code.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g) || []).length

    // Calculate cyclomatic complexity (simplified)
    // Base complexity of 1, +1 for each decision point
    let complexity = 1
    complexity += loops // while loops
    complexity += conditionals // if statements
    complexity += (code.match(/\belse\b/g) || []).length // else branches
    complexity += (code.match(/&&|\|\|/g) || []).length // logical operators

    // Generate suggestions based on analysis
    const suggestions: string[] = []
    
    if (lines.length > 50) {
      suggestions.push('Consider breaking large code into smaller functions')
    }
    
    if (comments === 0 && nonEmptyLines > 10) {
      suggestions.push('Add comments to explain complex logic')
    }
    
    if (complexity > 10) {
      suggestions.push('High complexity detected. Consider refactoring to simplify logic')
    }
    
    if (variables.size > 15) {
      suggestions.push('Large number of variables. Consider grouping related data')
    }
    
    const longLines = lines.filter(line => line.length > 80)
    if (longLines.length > 0) {
      suggestions.push(`${longLines.length} lines exceed 80 characters. Consider breaking them up`)
    }
    
    // Check for deeply nested code
    const maxIndent = Math.max(...lines.map(line => {
      const match = line.match(/^(\s*)/)
      return match ? match[1].length : 0
    }))
    if (maxIndent > 12) {
      suggestions.push('Deep nesting detected. Consider flattening the code structure')
    }

    if (suggestions.length === 0) {
      suggestions.push('Code looks good! No major issues detected.')
    }

    return {
      lines: lines.length,
      nonEmptyLines,
      comments,
      functions,
      loops,
      conditionals,
      variables,
      complexity,
      suggestions
    }
  }, [code])

  // Determine complexity level
  const getComplexityLevel = (complexity: number): { level: string; color: string } => {
    if (complexity <= 5) return { level: 'Simple', color: 'text-green-400' }
    if (complexity <= 10) return { level: 'Moderate', color: 'text-yellow-400' }
    if (complexity <= 20) return { level: 'Complex', color: 'text-orange-400' }
    return { level: 'Very Complex', color: 'text-red-400' }
  }

  const complexityInfo = getComplexityLevel(analysis.complexity)

  return (
    <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Code Analysis</h3>
        <Button
          variant="secondary"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-[var(--color-bg)] rounded-lg p-3">
          <div className="text-xs text-[var(--color-muted)]">Lines</div>
          <div className="text-2xl font-bold text-[var(--color-accent)]">
            {analysis.lines}
          </div>
          <div className="text-xs text-[var(--color-muted)]">
            {analysis.nonEmptyLines} non-empty
          </div>
        </div>

        <div className="bg-[var(--color-bg)] rounded-lg p-3">
          <div className="text-xs text-[var(--color-muted)]">Complexity</div>
          <div className={`text-2xl font-bold ${complexityInfo.color}`}>
            {analysis.complexity}
          </div>
          <div className="text-xs text-[var(--color-muted)]">
            {complexityInfo.level}
          </div>
        </div>

        <div className="bg-[var(--color-bg)] rounded-lg p-3">
          <div className="text-xs text-[var(--color-muted)]">Variables</div>
          <div className="text-2xl font-bold text-blue-400">
            {analysis.variables.size}
          </div>
          <div className="text-xs text-[var(--color-muted)]">
            defined
          </div>
        </div>

        <div className="bg-[var(--color-bg)] rounded-lg p-3">
          <div className="text-xs text-[var(--color-muted)]">Structures</div>
          <div className="text-2xl font-bold text-purple-400">
            {analysis.loops + analysis.conditionals}
          </div>
          <div className="text-xs text-[var(--color-muted)]">
            control flow
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      {showDetails && (
        <div className="space-y-3">
          <div className="bg-[var(--color-bg)] rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Detailed Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Comments:</span>
                <span className="text-white">{analysis.comments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Function Calls:</span>
                <span className="text-white">{analysis.functions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Loops:</span>
                <span className="text-white">{analysis.loops}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Conditionals:</span>
                <span className="text-white">{analysis.conditionals}</span>
              </div>
            </div>
          </div>

          {/* Variables List */}
          {analysis.variables.size > 0 && (
            <div className="bg-[var(--color-bg)] rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Variables ({analysis.variables.size})</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(analysis.variables).map((varName) => (
                  <span
                    key={varName}
                    className="px-2 py-1 bg-[var(--color-surface)] rounded text-xs font-mono"
                  >
                    {varName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Suggestions</h4>
        <div className="space-y-2">
          {analysis.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm bg-blue-500/10 border border-blue-500/30 rounded-lg p-2"
            >
              <span className="text-blue-400 mt-0.5">•</span>
              <span className="text-blue-200">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity Chart (Simple Bar) */}
      <div className="mt-4">
        <div className="text-xs text-[var(--color-muted)] mb-1">Complexity Scale</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-6 bg-[var(--color-bg)] rounded-lg overflow-hidden">
            <div
              className={`h-full ${
                analysis.complexity <= 5 ? 'bg-green-500' :
                analysis.complexity <= 10 ? 'bg-yellow-500' :
                analysis.complexity <= 20 ? 'bg-orange-500' :
                'bg-red-500'
              } transition-all duration-300`}
              style={{ width: `${Math.min(100, (analysis.complexity / 30) * 100)}%` }}
            />
          </div>
          <span className="text-sm font-mono">{analysis.complexity}</span>
        </div>
        <div className="flex justify-between text-xs text-[var(--color-muted)] mt-1">
          <span>Simple (1-5)</span>
          <span>Moderate (6-10)</span>
          <span>Complex (11-20)</span>
          <span>Very Complex (20+)</span>
        </div>
      </div>
    </div>
  )
}
