import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export default function Button({ variant = 'secondary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105'
  const variantStyles = variant === 'primary'
    ? 'bg-[var(--color-accent)] text-white hover:opacity-90'
    : 'bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.12)]'

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  )
}
