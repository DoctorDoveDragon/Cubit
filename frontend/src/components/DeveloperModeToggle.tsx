/**
 * Developer Mode Toggle Component
 * Allows switching between Learning Mode and Developer Mode
 * with keyboard shortcut (Ctrl+Shift+D)
 */

'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCode, FiBookOpen } from 'react-icons/fi'
import { useDeveloperMode } from '../hooks/useDeveloperMode'

interface DeveloperModeToggleProps {
  className?: string
}

export default function DeveloperModeToggle({ className = '' }: DeveloperModeToggleProps) {
  const { isDeveloperMode, toggleMode } = useDeveloperMode()

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        toggleMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleMode])

  return (
    <motion.div
      className={`relative inline-flex items-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={toggleMode}
        className={`
          relative flex items-center gap-3 px-6 py-3 rounded-xl font-bold
          transition-all duration-300 shadow-lg hover:shadow-xl
          ${isDeveloperMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-green-400 border-2 border-green-500' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-300'
          }
        `}
        title="Toggle Developer Mode (Ctrl+Shift+D)"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: isDeveloperMode ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {isDeveloperMode ? (
            <FiCode className="w-5 h-5" />
          ) : (
            <FiBookOpen className="w-5 h-5" />
          )}
        </motion.div>

        {/* Text */}
        <span className="text-sm">
          {isDeveloperMode ? 'Developer Mode' : 'Learning Mode'}
        </span>

        {/* Toggle Indicator */}
        <div className="relative w-12 h-6 bg-white/20 rounded-full">
          <motion.div
            className={`absolute top-1 w-4 h-4 rounded-full ${
              isDeveloperMode ? 'bg-green-400' : 'bg-white'
            }`}
            animate={{ left: isDeveloperMode ? '28px' : '4px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      </button>

      {/* Keyboard Shortcut Hint */}
      <div className={`
        absolute -bottom-8 left-1/2 transform -translate-x-1/2
        text-xs px-2 py-1 rounded whitespace-nowrap
        ${isDeveloperMode ? 'bg-gray-700 text-gray-300' : 'bg-purple-100 text-purple-700'}
      `}>
        Ctrl+Shift+D
      </div>
    </motion.div>
  )
}
