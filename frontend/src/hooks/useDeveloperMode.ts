/**
 * Hook for managing developer mode state and preferences
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DeveloperMode, DeveloperPreferences } from '../types/developer'

const STORAGE_KEY = 'cubit_developer_preferences'

const DEFAULT_PREFERENCES: DeveloperPreferences = {
  mode: 'learning',
  theme: 'light',
  editorTheme: 'vs-light',
  fontSize: 14,
  enableVim: false,
  enableAutocomplete: true,
  enableLinting: true,
}

export function useDeveloperMode() {
  const [preferences, setPreferences] = useState<DeveloperPreferences>(DEFAULT_PREFERENCES)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed })
        }
      } catch (error) {
        console.error('Failed to load developer preferences:', error)
      } finally {
        setIsLoaded(true)
      }
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
      } catch (error) {
        console.error('Failed to save developer preferences:', error)
      }
    }
  }, [preferences, isLoaded])

  const setMode = useCallback((mode: DeveloperMode) => {
    setPreferences(prev => ({
      ...prev,
      mode,
      theme: mode === 'developer' ? 'dark' : 'light',
      editorTheme: mode === 'developer' ? 'vs-dark' : 'vs-light',
    }))
  }, [])

  const toggleMode = useCallback(() => {
    setPreferences(prev => {
      const newMode = prev.mode === 'learning' ? 'developer' : 'learning'
      return {
        ...prev,
        mode: newMode,
        theme: newMode === 'developer' ? 'dark' : 'light',
        editorTheme: newMode === 'developer' ? 'vs-dark' : 'vs-light',
      }
    })
  }, [])

  const updatePreferences = useCallback((updates: Partial<DeveloperPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
  }, [])

  return {
    preferences,
    isDeveloperMode: preferences.mode === 'developer',
    isLoaded,
    setMode,
    toggleMode,
    updatePreferences,
    resetPreferences,
  }
}
