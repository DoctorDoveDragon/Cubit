'use client'

import React, { useState, useEffect } from 'react'
import { checkApiHealth } from '../utils/api'

export default function ApiHealthIndicator() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(true)

  useEffect(() => {
    // Check health immediately on mount
    checkHealth()

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const healthy = await checkApiHealth()
      setIsHealthy(healthy)
    } catch {
      setIsHealthy(false)
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusColor = () => {
    if (isChecking) return 'bg-yellow-500'
    if (isHealthy === null) return 'bg-gray-500'
    return isHealthy ? 'bg-green-500' : 'bg-red-500'
  }

  const getStatusText = () => {
    if (isChecking) return 'Checking...'
    if (isHealthy === null) return 'Unknown'
    return isHealthy ? 'API Connected' : 'API Disconnected'
  }

  const getStatusTitle = () => {
    if (isChecking) return 'Checking API health...'
    if (isHealthy === null) return 'API health status unknown'
    return isHealthy ? 'Backend API is healthy and responding' : 'Backend API is not responding'
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)]"
      title={getStatusTitle()}
    >
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${isChecking ? 'animate-pulse' : ''}`} />
      <span className="text-xs text-[var(--color-muted)]">{getStatusText()}</span>
    </div>
  )
}
