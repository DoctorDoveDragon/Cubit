'use client'

import React, { useEffect, useState } from 'react'
import { checkApiHealth, getModuleStatus } from '@/src/utils/api'

export default function ApiHealthDashboard() {
  const [health, setHealth] = useState<boolean | null>(null)
  const [systemInfo, setSystemInfo] = useState<{
    total_modules: number;
    active_modules: number;
    error_modules: number;
    uptime_seconds: number;
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      setLoading(true)
      try {
        const isHealthy = await checkApiHealth()
        setHealth(isHealthy)
        
        if (isHealthy) {
          const status = await getModuleStatus()
          setSystemInfo(status.system)
        }
      } catch (error) {
        console.error('Health check failed:', error)
        setHealth(false)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hours}h ${minutes}m ${secs}s`
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">API Health Status</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-3xl mb-2 ${health ? 'text-green-500' : 'text-red-500'}`}>
            {loading ? '⏳' : health ? '✅' : '❌'}
          </div>
          <div className="text-sm font-medium">API Status</div>
          <div className="text-xs text-gray-600">
            {loading ? 'Checking...' : health ? 'Healthy' : 'Unhealthy'}
          </div>
        </div>

        {systemInfo && (
          <>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {systemInfo.total_modules}
              </div>
              <div className="text-sm font-medium">Total Modules</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {systemInfo.active_modules}
              </div>
              <div className="text-sm font-medium">Active</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {formatUptime(systemInfo.uptime_seconds)}
              </div>
              <div className="text-sm font-medium">Uptime</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
