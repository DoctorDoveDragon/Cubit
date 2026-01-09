'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ApiHealthIndicator from './ApiHealthIndicator'
import { FiCode, FiStar, FiZap } from 'react-icons/fi'

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl mb-6"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 opacity-90"></div>
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-300/10 rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          {/* Animated Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/30"
          >
            <FiCode className="w-8 h-8 text-white" />
          </motion.div>
          
          <div>
            <motion.h1 
              className="text-3xl font-bold text-white flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Cubit 🎨
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-white/90 mt-1 font-medium flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FiZap className="w-4 h-4" />
              Learn Coding Through Play! 🚀
            </motion.p>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <ApiHealthIndicator />
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 shadow-lg"
          >
            <span className="text-white font-bold flex items-center gap-2">
              <FiStar className="w-4 h-4" />
              v1.0.0
            </span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
