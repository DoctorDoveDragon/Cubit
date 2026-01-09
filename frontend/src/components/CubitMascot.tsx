'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CubitMascotProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging'
  message?: string
  show?: boolean
}

export default function CubitMascot({ 
  mood = 'happy', 
  message = '', 
  show = true 
}: CubitMascotProps) {
  const [currentMood, setCurrentMood] = useState(mood)
  const [bouncing, setBouncing] = useState(false)

  useEffect(() => {
    setCurrentMood(mood)
    if (mood === 'celebrating' || mood === 'excited') {
      setBouncing(true)
      setTimeout(() => setBouncing(false), 2000)
    }
  }, [mood])

  const getMascotFace = () => {
    switch (currentMood) {
      case 'happy':
        return '😊'
      case 'excited':
        return '🤩'
      case 'thinking':
        return '🤔'
      case 'celebrating':
        return '🎉'
      case 'encouraging':
        return '💪'
      default:
        return '😊'
    }
  }

  const bounceAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 0.5,
      repeat: bouncing ? 4 : 0,
      ease: "easeInOut"
    }
  }

  const floatAnimation = {
    y: [-5, 5, -5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-8 right-8 z-50"
        >
          {/* Mascot */}
          <motion.div
            animate={bouncing ? bounceAnimation : floatAnimation}
            className="relative"
          >
            {/* Speech Bubble */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full mb-4 right-0 bg-white rounded-2xl px-4 py-3 shadow-xl border-2 border-purple-200 max-w-xs"
              >
                <p className="text-sm font-medium text-gray-800">{message}</p>
                {/* Arrow */}
                <div className="absolute top-full right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
              </motion.div>
            )}

            {/* Mascot Character - Cubit the Cube */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
              
              {/* Main Body */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 w-20 h-20 rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white"
              >
                <div className="text-4xl">{getMascotFace()}</div>
                
                {/* Sparkle Effects */}
                {currentMood === 'celebrating' && (
                  <>
                    <motion.div
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [-20, -40],
                        y: [-20, -40],
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    />
                    <motion.div
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [20, 40],
                        y: [-20, -40],
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                      className="absolute w-2 h-2 bg-pink-400 rounded-full"
                    />
                    <motion.div
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, 0],
                        y: [-30, -60],
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    />
                  </>
                )}
              </motion.div>

              {/* Shadow */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/20 rounded-full blur-sm"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
