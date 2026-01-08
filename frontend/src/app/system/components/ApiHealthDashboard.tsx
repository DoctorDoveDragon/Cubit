'use client'

import { useEffect, useState } from 'react'
import { checkApiHealth } from '@/utils/api'

export default function ApiHealthDashboard() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await checkApiHealth()
      setIsHealthy(healthy)
      setLastChecked(new Date())
    }

    checkHealth()
    const interval = setInterval(checkHealth, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">API Health</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Status</div>
          {isHealthy === null ? (
            <div className="text-lg font-semibold text-gray-400">Checking...</div>
          ) : isHealthy ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="text-lg font-semibold text-green-400">Healthy</div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="text-lg font-semibold text-red-400">Disconnected</div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Endpoint</div>
          <div className="text-sm font-mono text-gray-300 truncate">
            {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Last Checked</div>
          <div className="text-sm text-gray-300">
            {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
          </div>
        </div>
      </div>

      {isHealthy === false && (
        <div className="mt-4 bg-red-950 border border-red-800 rounded-lg p-4">
          <div className="text-sm text-red-400">
            ⚠️ Unable to connect to the backend API. Please ensure:
          </div>
          <ul className="mt-2 text-sm text-red-300 list-disc list-inside space-y-1">
            <li>The backend server is running (python api.py)</li>
            <li>NEXT_PUBLIC_API_URL is set correctly</li>
            <li>CORS is properly configured on the backend</li>
          </ul>
        </div>
      )}
    </div>
  )
}
