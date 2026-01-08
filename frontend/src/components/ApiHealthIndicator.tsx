'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { checkApiHealth } from '../utils/api'

const BASE_INTERVAL = 30000 // 30 seconds
const MAX_INTERVAL = 300000 // 5 minutes

export default function ApiHealthIndicator() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(true)
  const [checkInterval, setCheckInterval] = useState<number>(BASE_INTERVAL)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const consecutiveFailures = useRef<number>(0)

  const calculateBackoffInterval = useCallback((failures: number): number => {
    return Math.min(BASE_INTERVAL * Math.pow(2, failures), MAX_INTERVAL)
  }, [])

  const handleHealthCheckSuccess = useCallback(() => {
    consecutiveFailures.current = 0
    if (checkInterval !== BASE_INTERVAL) {
      setCheckInterval(BASE_INTERVAL)
    }
  }, [checkInterval])

  const handleHealthCheckFailure = useCallback(() => {
    consecutiveFailures.current++
    const newInterval = calculateBackoffInterval(consecutiveFailures.current)
    if (newInterval !== checkInterval) {
      setCheckInterval(newInterval)
    }
  }, [checkInterval, calculateBackoffInterval])

  const checkHealth = useCallback(async () => {
    setIsChecking(true)
    try {
      const healthy = await checkApiHealth()
      setIsHealthy(healthy)
      handleHealthCheckSuccess()
    } catch {
      setIsHealthy(false)
      handleHealthCheckFailure()
    } finally {
      setIsChecking(false)
    }
  }, [handleHealthCheckSuccess, handleHealthCheckFailure])

  const clearHealthCheckInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const setupHealthCheckInterval = useCallback(() => {
    clearHealthCheckInterval()
    intervalRef.current = setInterval(checkHealth, checkInterval)
  }, [checkHealth, checkInterval, clearHealthCheckInterval])

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      clearHealthCheckInterval()
    } else {
      checkHealth()
      setupHealthCheckInterval()
    }
  }, [checkHealth, clearHealthCheckInterval, setupHealthCheckInterval])

  // Initial health check and interval setup
  useEffect(() => {
    checkHealth()
    setupHealthCheckInterval()

    return clearHealthCheckInterval
  }, [checkHealth, setupHealthCheckInterval, clearHealthCheckInterval])

  // Handle page visibility changes
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [handleVisibilityChange])

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
