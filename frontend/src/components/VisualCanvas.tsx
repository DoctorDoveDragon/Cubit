'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shape } from '../types/api'

interface VisualCanvasProps {
  shapes?: Shape[]
  width?: number
  height?: number
}

export default function VisualCanvas({ shapes = [], width = 400, height = 400 }: VisualCanvasProps) {
  const [animatedShapes, setAnimatedShapes] = useState<Shape[]>([])

  useEffect(() => {
    setAnimatedShapes(shapes)
  }, [shapes])

  const getShapePath = (shape: Shape) => {
    const { type, x, y, size } = shape
    
    switch (type) {
      case 'circle':
        return null // Will use circle element
      case 'square':
        return `M ${x - size/2} ${y - size/2} 
                L ${x + size/2} ${y - size/2} 
                L ${x + size/2} ${y + size/2} 
                L ${x - size/2} ${y + size/2} Z`
      case 'triangle':
        return `M ${x} ${y - size/2} 
                L ${x + size/2} ${y + size/2} 
                L ${x - size/2} ${y + size/2} Z`
      default:
        return null
    }
  }

  const shapeVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.15,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-white/30 shadow-xl">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#7c3aed" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Canvas Title */}
      {animatedShapes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-6xl">🎨</div>
            <p className="text-lg font-bold text-purple-600">Visual Canvas</p>
            <p className="text-sm text-gray-500">Run code with draw commands to see magic! ✨</p>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <svg 
        width={width} 
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-10"
      >
        <AnimatePresence>
          {animatedShapes.map((shape, index) => {
            if (shape.type === 'circle') {
              return (
                <motion.circle
                  key={`shape-${index}`}
                  cx={shape.x}
                  cy={shape.y}
                  r={shape.size}
                  fill={shape.color}
                  stroke="white"
                  strokeWidth="3"
                  variants={shapeVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  exit={{ scale: 0, opacity: 0 }}
                  style={{
                    filter: 'drop-shadow(0 4px 12px rgba(124, 58, 237, 0.3))',
                    cursor: 'pointer'
                  }}
                />
              )
            } else {
              const path = getShapePath(shape)
              return (
                <motion.path
                  key={`shape-${index}`}
                  d={path || ''}
                  fill={shape.color}
                  stroke="white"
                  strokeWidth="3"
                  variants={shapeVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  exit={{ scale: 0, opacity: 0 }}
                  style={{
                    filter: 'drop-shadow(0 4px 12px rgba(124, 58, 237, 0.3))',
                    cursor: 'pointer'
                  }}
                />
              )
            }
          })}
        </AnimatePresence>
      </svg>

      {/* Shape Counter */}
      {animatedShapes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
        >
          <span className="text-sm font-bold text-purple-600">
            {animatedShapes.length} {animatedShapes.length === 1 ? 'Shape' : 'Shapes'} 🎉
          </span>
        </motion.div>
      )}
    </div>
  )
}
