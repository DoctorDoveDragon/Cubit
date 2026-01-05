'use client'

import React, { useState } from 'react'
import Button from './Button'
import NaturalLanguageInput from './NaturalLanguageInput'
import { executeCode, ExecuteResponse } from '../utils/api'
import { CUBIT_EXAMPLES, getExamplesList } from '../constants/examples'
import { safeErrorMessage } from '../utils/safeError'

export default function CodeExecutor() {
  const [code, setCode] = useState<string>(CUBIT_EXAMPLES.hello.code)
  const [output, setOutput] = useState<ExecuteResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedExample, setSelectedExample] = useState<string>('hello')
  const [teachingEnabled, setTeachingEnabled] = useState<boolean>(false)
  const [verbosity, setVerbosity] = useState<'minimal' | 'normal' | 'detailed'>('normal')

  const handleRunCode = async () => {
    setLoading(true)
    setOutput(null)

    try {
      const result = await executeCode({
        code,
        teaching_enabled: teachingEnabled,
        verbosity: teachingEnabled ? verbosity : undefined
      })
      setOutput(result)
    } catch (err: unknown) {
      setOutput({
        output: null,
        result: null,
        error: safeErrorMessage(err)
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLoadExample = (exampleKey: string) => {
    const example = CUBIT_EXAMPLES[exampleKey]
    if (example) {
      setCode(example.code)
      setSelectedExample(exampleKey)
      setOutput(null)
    }
  }

  const examples = getExamplesList()

  return (
    <div className="space-y-4">
      {/* Example Snippets Dropdown */}
      <div className="flex items-center gap-3">
        <label htmlFor="examples" className="text-sm font-medium">
          Load Example:
        </label>
        <select
          id="examples"
          value={selectedExample}
          onChange={(e) => handleLoadExample(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] text-white text-sm focus:outline-none focus:border-[var(--color-accent)]"
        >
          {examples.map((example, idx) => (
            <option key={idx} value={Object.keys(CUBIT_EXAMPLES)[idx]}>
              {example.name} - {example.description}
            </option>
          ))}
        </select>
      </div>

      {/* Teaching Controls */}
      <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="teaching-toggle" className="text-sm font-medium">
            Teaching Mode
          </label>
          <button
            id="teaching-toggle"
            onClick={() => setTeachingEnabled(!teachingEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${teachingEnabled ? 'bg-[var(--color-accent)]' : 'bg-gray-600'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${teachingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        {teachingEnabled && (
          <div className="flex items-center gap-3">
            <label htmlFor="verbosity" className="text-sm font-medium">
              Verbosity:
            </label>
            <select
              id="verbosity"
              value={verbosity}
              onChange={(e) => setVerbosity(e.target.value as 'minimal' | 'normal' | 'detailed')}
              className="px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[rgba(255,255,255,0.12)] text-white text-sm focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="minimal">Minimal - Quick tips</option>
              <option value="normal">Normal - Balanced explanation</option>
              <option value="detailed">Detailed - In-depth teaching</option>
            </select>
          </div>
        )}
      </div>

      {/* Natural Language to Code Input */}
      <NaturalLanguageInput onCode={setCode} />

      {/* Code Editor */}
      <div>
        <label htmlFor="code-editor" className="block text-sm font-medium mb-2">
          Cubit Code:
        </label>
        <textarea
          id="code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] text-white font-mono text-sm resize-y focus:outline-none focus:border-[var(--color-accent)]"
          placeholder="Enter your Cubit code here..."
          spellCheck={false}
        />
      </div>

      {/* Run Button */}
      <div>
        <Button
          variant="primary"
          onClick={handleRunCode}
          disabled={loading || !code.trim()}
          className="w-full sm:w-auto"
        >
          {loading ? 'Running...' : 'Run Code'}
        </Button>
      </div>

      {/* Output Display */}
      {output && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Output:</h4>

          {/* Skill Level Badge */}
          {output.skill_level && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-muted)]">Detected Skill Level:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${output.skill_level === 'beginner' ? 'bg-green-500/20 text-green-300' :
                output.skill_level === 'intermediate' ? 'bg-blue-500/20 text-blue-300' :
                  output.skill_level === 'advanced' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-yellow-500/20 text-yellow-300'
                }`}>
                {output.skill_level.charAt(0).toUpperCase() + output.skill_level.slice(1)}
              </span>
            </div>
          )}

          {/* Teaching Moment */}
          {output.teaching_moment && (
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🎓</span>
                <div className="text-sm font-medium text-purple-300">Learning Moment</div>
                <span className="text-xs text-[var(--color-muted)] ml-auto">
                  [{output.teaching_moment.level?.toUpperCase() || 'INFO'}]
                </span>
              </div>
              
              <div className="space-y-3 text-sm">
                {output.teaching_moment.explanation && (
                  <div>
                    <div className="text-xs text-purple-200 font-medium mb-1">💡 Explanation:</div>
                    <div className="text-purple-100">{output.teaching_moment.explanation}</div>
                  </div>
                )}
                
                {output.teaching_moment.why_it_exists && (
                  <div>
                    <div className="text-xs text-blue-200 font-medium mb-1">🔍 Why This Matters:</div>
                    <div className="text-blue-100">{output.teaching_moment.why_it_exists}</div>
                  </div>
                )}
                
                {output.teaching_moment.simple_analogy && (
                  <div>
                    <div className="text-xs text-green-200 font-medium mb-1">🌟 Think of It Like:</div>
                    <div className="text-green-100 italic">{output.teaching_moment.simple_analogy}</div>
                  </div>
                )}
                
                {output.teaching_moment.pitfalls && output.teaching_moment.pitfalls.length > 0 && (
                  <div>
                    <div className="text-xs text-yellow-200 font-medium mb-1">⚠️ Common Pitfalls:</div>
                    <ul className="text-yellow-100 space-y-1">
                      {output.teaching_moment.pitfalls.map((pitfall: string) => (
                        <li key={pitfall}>• {pitfall}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {output.teaching_moment.best_practices && output.teaching_moment.best_practices.length > 0 && (
                  <div>
                    <div className="text-xs text-cyan-200 font-medium mb-1">✨ Best Practices:</div>
                    <ul className="text-cyan-100 space-y-1">
                      {output.teaching_moment.best_practices.map((practice: string) => (
                        <li key={practice}>• {practice}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Standard Output */}
          {output.output && (
            <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-muted)] mb-2">Standard Output:</div>
              <pre className="text-sm text-white whitespace-pre-wrap font-mono">
                {output.output}
              </pre>
            </div>
          )}

          {/* Result Value */}
          {output.result !== null && output.result !== undefined && (
            <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-muted)] mb-2">Result:</div>
              <pre className="text-sm text-[var(--color-accent)] font-mono">
                {JSON.stringify(output.result, null, 2)}
              </pre>
            </div>
          )}

          {/* Error Messages */}
          {output.error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <div className="text-xs text-red-300 mb-2">Error:</div>
              <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono">
                {output.error}
              </pre>
            </div>
          )}

          {/* Progress Information */}
          {output.progress && (
            <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-muted)] mb-2">Learning Progress:</div>
              <div className="space-y-2 text-sm">
                <div>Total Function Calls: <span className="text-[var(--color-accent)]">{output.progress.total_calls}</span></div>
                {output.progress.method_diversity && output.progress.method_diversity.length > 0 && (
                  <div>
                    <div className="text-xs text-[var(--color-muted)] mb-1">Methods Used:</div>
                    <div className="flex flex-wrap gap-1">
                      {output.progress.method_diversity.map((method, idx) => (
                        <span key={idx} className="px-2 py-1 bg-[var(--color-bg)] rounded text-xs font-mono">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {output.progress.mastered_concepts && output.progress.mastered_concepts.length > 0 && (
                  <div>
                    <div className="text-xs text-[var(--color-muted)] mb-1">Mastered Concepts:</div>
                    <div className="flex flex-wrap gap-1">
                      {output.progress.mastered_concepts.map((concept, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Learning Suggestions */}
          {output.suggestions && output.suggestions.length > 0 && (
            <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
              <div className="text-xs text-blue-300 mb-2">Next Learning Steps:</div>
              <ul className="space-y-1 text-sm text-blue-200">
                {output.suggestions.map((suggestion, idx) => (
                  <li key={idx}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* No output message */}
          {!output.output && !output.result && !output.error && (
            <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4 text-center text-[var(--color-muted)]">
              Code executed successfully with no output
            </div>
          )}
        </div>
      )}
    </div>
  )
}