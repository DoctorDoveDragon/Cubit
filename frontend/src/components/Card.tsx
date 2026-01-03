import React from 'react'

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="card">
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
