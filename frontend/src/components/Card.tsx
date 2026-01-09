import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  gradient?: boolean
}

export default function Card({ children, className = '', gradient = false }: CardProps) {
  const baseClasses = 'rounded-2xl p-6 border-2 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1'
  
  const styleClasses = gradient
    ? 'bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm border-white/50'
    : 'bg-white/90 backdrop-blur-sm border-white/50'

  return (
    <div className={`${baseClasses} ${styleClasses} ${className}`}>
      {children}
    </div>
  )
}
