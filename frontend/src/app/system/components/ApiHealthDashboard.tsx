'use client'

import { useEffect, useState } from 'react'
import { checkApiHealth } from '@/utils/api'

export default function ApiHealthDashboard() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [lastCheck, setLastCheck] = useState<Date>(new Date())
  const [isChecking, setIsChecking] = useState(false)

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const healthy = await checkApiHealth()
      setIsHealthy(healthy)
      setLastCheck(new Date())
    } catch (error) {
      setIsHealthy(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkHealth()
    
    // Poll every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    if (isHealthy === null) return 'bg-gray-500'
    return isHealthy ? 'bg-green-500' : 'bg-red-500'
  }

  const getStatusText = () => {
    if (isHealthy === null) return 'Checking...'
    return isHealthy ? 'Healthy' : 'Unhealthy'
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">API Health Status</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Indicator */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Status</span>
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${isHealthy ? 'animate-pulse' : ''}`} />
          </div>
          <div className="text-2xl font-bold">{getStatusText()}</div>
        </div>

        {/* Last Check */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-4">Last Check</div>
          <div className="text-2xl font-bold">
            {lastCheck.toLocaleTimeString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {lastCheck.toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center">
          <button
            onClick={checkHealth}
            disabled={isChecking}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors font-medium w-full"
          >
            {isChecking ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Checking...
              </span>
            ) : (
              'Check Now'
            )}
          </button>
        </div>
      </div>

      {/* Health Details */}
      {isHealthy !== null && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Endpoint</div>
              <div className="font-mono text-sm text-white">GET /health</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Response Time</div>
              <div className="font-mono text-sm text-white">&lt; 5000ms</div>
            </div>
          </div>
        </div>
      )}

      {isHealthy === false && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <div className="font-semibold text-red-400 mb-1">Backend API Unavailable</div>
              <div className="text-sm text-red-300">
                The backend API is not responding. Please ensure the backend server is running.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
