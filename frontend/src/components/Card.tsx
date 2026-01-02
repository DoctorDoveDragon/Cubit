import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-xl p-6 border border-[rgba(255,255,255,0.08)] ${className}`}>
      {children}
    </div>
  )
}
