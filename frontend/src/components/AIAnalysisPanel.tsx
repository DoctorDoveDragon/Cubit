'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiAward, FiTarget, FiZap } from 'react-icons/fi'

interface AIAnalysisPanelProps {
  skillLevel?: string
  progress?: {
    total_calls: number
    method_diversity: string[]
    mastered_concepts?: string[]
  }
  suggestions?: string[]
}

export default function AIAnalysisPanel({ 
  skillLevel = 'beginner',
  progress,
  suggestions = []
}: AIAnalysisPanelProps) {
  
  const getSkillColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'from-green-400 to-emerald-500'
      case 'intermediate':
        return 'from-blue-400 to-cyan-500'
      case 'advanced':
        return 'from-purple-400 to-violet-500'
      case 'expert':
        return 'from-pink-400 to-rose-500'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
          <FiZap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">AI Code Analysis 🤖</h3>
          <p className="text-sm text-gray-600">Smart insights about your code</p>
        </div>
      </div>

      {/* Skill Level Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-white/50"
      >
        <div className="flex items-center gap-3 mb-3">
          <FiAward className="w-5 h-5 text-purple-600" />
          <h4 className="font-bold text-gray-800">Your Skill Level</h4>
        </div>
        <div className={`inline-block bg-gradient-to-r ${getSkillColor(skillLevel)} text-white px-6 py-3 rounded-full font-bold text-lg shadow-md`}>
          🌟 {skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}
        </div>
      </motion.div>

      {/* Progress Stats */}
      {progress && (
        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-white/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <FiTrendingUp className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-gray-800">Your Progress</h4>
          </div>
          
          <div className="space-y-4">
            {/* Total Calls */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Commands:</span>
              <span className="text-2xl font-bold text-purple-600">{progress.total_calls}</span>
            </div>

            {/* Methods Learned */}
            {progress.method_diversity && progress.method_diversity.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Methods You've Used:</p>
                <div className="flex flex-wrap gap-2">
                  {progress.method_diversity.map((method, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-mono font-semibold border border-blue-200"
                    >
                      {method}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Mastered Concepts */}
            {progress.mastered_concepts && progress.mastered_concepts.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">🏆 Mastered Concepts:</p>
                <div className="flex flex-wrap gap-2">
                  {progress.mastered_concepts.map((concept, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: idx * 0.05, type: "spring" }}
                      className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-semibold border border-green-200"
                    >
                      ✓ {concept}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-white/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <FiTarget className="w-5 h-5 text-pink-600" />
            <h4 className="font-bold text-gray-800">Next Steps</h4>
          </div>
          
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200"
              >
                <div className="mt-1 w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{idx + 1}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Encouragement Message */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 shadow-lg border-2 border-yellow-200"
      >
        <p className="text-center text-lg font-bold text-gray-800">
          🌟 Keep coding! You're doing great! 🚀
        </p>
      </motion.div>
    </motion.div>
  )
}
