'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiCode, FiEye } from 'react-icons/fi'
import Button from './Button'
import NaturalLanguageInput from './NaturalLanguageInput'
import VisualCanvas from './VisualCanvas'
import AIAnalysisPanel from './AIAnalysisPanel'
import { executeCode, ExecuteResponse } from '../utils/api'
import { CUBIT_EXAMPLES, getExamplesList } from '../constants/examples'
import { safeErrorMessage } from '../utils/safeError'
import Confetti from 'react-confetti'

export default function CodeExecutor() {
  const [code, setCode] = useState<string>(CUBIT_EXAMPLES.hello.code)
  const [output, setOutput] = useState<ExecuteResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedExample, setSelectedExample] = useState<string>('hello')
  const [teachingEnabled, setTeachingEnabled] = useState<boolean>(false)
  const [verbosity, setVerbosity] = useState<'minimal' | 'normal' | 'detailed'>('normal')
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [showAIPanel, setShowAIPanel] = useState<boolean>(false)

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
      
      // Show confetti on successful execution without errors
      if (!result.error && result.shapes && result.shapes.length > 0) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
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
    <>
      {/* Success Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="space-y-4">
        {/* Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example Selector */}
          <div className="flex items-center gap-3">
            <label htmlFor="examples" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FiCode className="w-4 h-4 text-purple-600" />
              Examples:
            </label>
            <select
              id="examples"
              value={selectedExample}
              onChange={(e) => handleLoadExample(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-white/90 border-2 border-purple-200 text-gray-700 font-medium focus:outline-none focus:border-purple-400 shadow-sm"
            >
              {examples.map((example, idx) => (
                <option key={idx} value={Object.keys(CUBIT_EXAMPLES)[idx]}>
                  {example.name} - {example.description}
                </option>
              ))}
            </select>
          </div>

          {/* Teaching Toggle */}
          <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <label htmlFor="teaching-toggle" className="text-sm font-bold text-gray-700">
              🎓 Teaching Mode
            </label>
            <button
              id="teaching-toggle"
              onClick={() => setTeachingEnabled(!teachingEnabled)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors shadow-inner ${
                teachingEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                  teachingEnabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Verbosity Control (if teaching enabled) */}
        {teachingEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border-2 border-blue-200"
          >
            <label htmlFor="verbosity" className="text-sm font-bold text-gray-700">
              Detail Level:
            </label>
            <select
              id="verbosity"
              value={verbosity}
              onChange={(e) => setVerbosity(e.target.value as 'minimal' | 'normal' | 'detailed')}
              className="flex-1 px-4 py-2 rounded-xl bg-white border-2 border-blue-200 text-gray-700 font-medium focus:outline-none focus:border-blue-400"
            >
              <option value="minimal">⚡ Minimal - Quick tips</option>
              <option value="normal">📚 Normal - Balanced</option>
              <option value="detailed">🔍 Detailed - In-depth</option>
            </select>
          </motion.div>
        )}

        {/* Natural Language Input */}
        <NaturalLanguageInput onCode={setCode} />

        {/* Split View: Code Editor + Visual Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Editor */}
          <div>
            <label htmlFor="code-editor" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FiCode className="w-4 h-4 text-purple-600" />
              Cubit Code:
            </label>
            <textarea
              id="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-80 px-4 py-3 rounded-xl bg-gray-50 border-2 border-purple-200 text-gray-800 font-mono text-sm resize-y focus:outline-none focus:border-purple-400 shadow-inner"
              placeholder="Enter your Cubit code here... ✨"
              spellCheck={false}
            />
          </div>

          {/* Visual Canvas */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FiEye className="w-4 h-4 text-pink-600" />
              Visual Output:
            </label>
            <div className="h-80">
              <VisualCanvas shapes={output?.shapes || []} width={400} height={320} />
            </div>
          </div>
        </div>

        {/* Run Button */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleRunCode}
            disabled={loading || !code.trim()}
            icon={<FiPlay />}
            className="flex-1 sm:flex-none text-lg"
          >
            {loading ? '⏳ Running...' : '▶️ Run Code'}
          </Button>
          
          {output && (output.progress || output.suggestions) && (
            <Button
              variant="secondary"
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="flex-1 sm:flex-none"
            >
              {showAIPanel ? 'Hide' : 'Show'} AI Analysis 🤖
            </Button>
          )}
        </div>

        {/* AI Analysis Panel */}
        <AnimatePresence>
          {showAIPanel && output && (output.progress || output.suggestions) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AIAnalysisPanel
                skillLevel={output.skill_level}
                progress={output.progress}
                suggestions={output.suggestions}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output Display */}
        {output && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              📊 Output:
            </h4>

            {/* Standard Output */}
            {output.output && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 shadow-inner">
                <div className="text-xs font-bold text-gray-600 mb-2">💬 Console:</div>
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {output.output}
                </pre>
              </div>
            )}

            {/* Result Value */}
            {output.result !== null && output.result !== undefined && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="text-xs font-bold text-purple-600 mb-2">✨ Result:</div>
                <pre className="text-sm text-purple-700 font-mono font-bold">
                  {JSON.stringify(output.result, null, 2)}
                </pre>
              </div>
            )}

            {/* Error Messages */}
            {output.error && (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-red-50 border-2 border-red-300 rounded-xl p-4"
              >
                <div className="text-xs font-bold text-red-600 mb-2">❌ Error:</div>
                <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
                  {output.error}
                </pre>
              </motion.div>
            )}

            {/* No output message */}
            {!output.output && !output.result && !output.error && !output.shapes?.length && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-700 font-medium">✅ Code executed successfully!</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  )
}
