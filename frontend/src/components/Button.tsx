'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning'
  children: React.ReactNode
  icon?: React.ReactNode
}

export default function Button({ 
  variant = 'secondary', 
  children, 
  className = '', 
  icon,
  disabled,
  ...props 
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
      case 'success':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 shadow-lg hover:shadow-xl'
      case 'warning':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
      case 'secondary':
      default:
        return 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white border-2 border-purple-200 hover:border-purple-300 shadow-md hover:shadow-lg'
    }
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        px-6 py-3 rounded-full font-bold transition-all duration-200 
        flex items-center gap-2 justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  )
}

