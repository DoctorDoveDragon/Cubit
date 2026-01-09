/**
 * Performance Profiler Component
 * Analyze code performance and identify bottlenecks
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiActivity, FiClock, FiZap } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { executeCode } from '../utils/api'

interface ProfileMetric {
  name: string
  time: number
  calls: number
  avgTime: number
}

const SAMPLE_CODE = `# Performance profiling example
function fibonacci(n) {
    if n <= 1 {
        return n
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

# Calculate fibonacci numbers
for i in range(10) {
    result = fibonacci(i)
    print("fib(" + str(i) + ") = " + str(result))
}`

export default function Profiler() {
  const [code, setCode] = useState(SAMPLE_CODE)
  const [isProfiling, setIsProfiling] = useState(false)
  const [metrics, setMetrics] = useState<ProfileMetric[]>([])
  const [totalTime, setTotalTime] = useState<number>(0)

  const handleProfile = async () => {
    setIsProfiling(true)
    const startTime = performance.now()

    try {
      await executeCode({
        code,
        teaching_enabled: false,
        verbosity: 'detailed'
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // NOTE: These are sample metrics for demonstration purposes
      // In a real implementation, profiling data would come from the backend
      const sampleMetrics: ProfileMetric[] = [
        { name: 'fibonacci', time: executionTime * 0.8, calls: 89, avgTime: (executionTime * 0.8) / 89 },
        { name: 'print', time: executionTime * 0.15, calls: 10, avgTime: (executionTime * 0.15) / 10 },
        { name: 'range', time: executionTime * 0.05, calls: 1, avgTime: executionTime * 0.05 },
      ]

      setMetrics(sampleMetrics)
      setTotalTime(executionTime)
    } catch (error) {
      console.error('Profiling error:', error)
    } finally {
      setIsProfiling(false)
    }
  }

  const chartData = metrics.map(m => ({
    name: m.name,
    'Time (ms)': parseFloat(m.time.toFixed(2)),
    'Calls': m.calls,
  }))

  return (
    <div className="space-y-6">
      {/* Demo Warning */}
      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
        <p className="text-sm text-yellow-300">
          <strong>Note:</strong> The profiler currently shows estimated metrics based on execution time. 
          Full profiling integration with the backend is planned for future releases.
        </p>
      </div>

      {/* Code Input */}
      <div>
        <label className="block text-sm font-bold text-gray-400 mb-2">
          Code to Profile
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 font-mono text-sm focus:outline-none focus:border-green-400"
          placeholder="Enter code to profile..."
        />
      </div>

      {/* Profile Button */}
      <button
        onClick={handleProfile}
        disabled={isProfiling}
        className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiPlay />
        {isProfiling ? 'Profiling...' : 'Run Profiler'}
      </button>

      {/* Results */}
      {metrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="text-blue-400" />
                <span className="text-sm text-gray-400">Total Time</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {totalTime.toFixed(2)} ms
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiActivity className="text-purple-400" />
                <span className="text-sm text-gray-400">Function Calls</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {metrics.reduce((sum, m) => sum + m.calls, 0)}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiZap className="text-yellow-400" />
                <span className="text-sm text-gray-400">Avg Call Time</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {(totalTime / metrics.reduce((sum, m) => sum + m.calls, 0)).toFixed(2)} ms
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-200 mb-4">Function Call Times</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="Time (ms)" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Function Details Table */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Function
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Calls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Total Time (ms)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Avg Time (ms)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {metrics.map((metric, idx) => (
                  <tr key={idx} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-green-400">
                      {metric.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {metric.calls}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {metric.time.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {metric.avgTime.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {((metric.time / totalTime) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Optimization Suggestions */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
              <FiZap />
              Optimization Suggestions
            </h3>
            <ul className="space-y-2 text-sm text-blue-300">
              <li>• Consider memoization for recursive functions like fibonacci</li>
              <li>• Use iterative approaches when possible to reduce call stack depth</li>
              <li>• Cache expensive computations to avoid redundant calculations</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}
