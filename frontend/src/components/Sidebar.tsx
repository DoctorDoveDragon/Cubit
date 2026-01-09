'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiHome, FiLayers, FiPalette, FiBook, FiAward, FiZap } from 'react-icons/fi'

export default function Sidebar() {
  const menuItems = [
    { label: 'Overview', icon: FiHome, active: true, color: 'from-purple-400 to-pink-500', emoji: '🏠' },
    { label: 'Lessons', icon: FiBook, active: false, color: 'from-blue-400 to-cyan-500', emoji: '📚' },
    { label: 'Games', icon: FiZap, active: false, color: 'from-green-400 to-emerald-500', emoji: '🎮' },
    { label: 'Challenges', icon: FiAward, active: false, color: 'from-yellow-400 to-orange-500', emoji: '🏆' },
    { label: 'Creative', icon: FiPalette, active: false, color: 'from-pink-400 to-rose-500', emoji: '🎨' },
  ]

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-sm border-r-4 border-purple-200 p-6 shadow-xl">
      {/* Logo Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg"
        >
          <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <FiLayers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Cubit</h2>
            <p className="text-xs text-white/80">Code & Play ✨</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Menu Items */}
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.a
              key={item.label}
              href="#"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, x: 5 }}
              className={`
                group relative block px-4 py-3 rounded-xl text-sm font-bold transition-all
                ${item.active
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${item.active 
                    ? 'bg-white/30 backdrop-blur-sm' 
                    : 'bg-gray-100 group-hover:bg-white'
                  }
                `}>
                  <Icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'}`} />
                </div>
                <span className="flex-1">{item.label}</span>
                <span className="text-xl">{item.emoji}</span>
              </div>

              {/* Active Indicator */}
              {item.active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                />
              )}
            </motion.a>
          )
        })}
      </nav>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-200"
      >
        <div className="flex items-center gap-2 mb-2">
          <FiAward className="w-5 h-5 text-orange-600" />
          <p className="font-bold text-gray-800">Your Progress</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
            />
          </div>
          <span className="text-sm font-bold text-gray-700">45%</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">Keep learning! 🌟</p>
      </motion.div>
    </aside>
  )
}
