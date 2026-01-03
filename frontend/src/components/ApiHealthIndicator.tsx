'use client'

import React, { useState, useEffect, useRef } from 'react'
import { checkApiHealth } from '../utils/api'

export default function ApiHealthIndicator() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(true)
  const [checkInterval, setCheckInterval] = useState<number>(30000) // Start with 30 seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const consecutiveFailures = useRef<number>(0)

  useEffect(() => {
    // Check health immediately on mount
    checkHealth()

    // Set up interval-based health checks
    const setupInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      intervalRef.current = setInterval(checkHealth, checkInterval)
    }

    setupInterval()

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [checkInterval])

  // Pause health checks when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause checks when tab is hidden
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else {
        // Resume checks when tab is visible
        checkHealth()
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        intervalRef.current = setInterval(checkHealth, checkInterval)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [checkInterval])

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const healthy = await checkApiHealth()
      setIsHealthy(healthy)
      
      if (healthy) {
        // Reset interval and failure count on success
        consecutiveFailures.current = 0
        if (checkInterval !== 30000) {
          setCheckInterval(30000)
        }
      } else {
        // Increase interval on failure (exponential backoff, max 5 minutes)
        consecutiveFailures.current++
        const newInterval = Math.min(30000 * Math.pow(2, consecutiveFailures.current), 300000)
        if (newInterval !== checkInterval) {
          setCheckInterval(newInterval)
        }
      }
    } catch {
      setIsHealthy(false)
      consecutiveFailures.current++
      const newInterval = Math.min(30000 * Math.pow(2, consecutiveFailures.current), 300000)
      if (newInterval !== checkInterval) {
        setCheckInterval(newInterval)
      }
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
