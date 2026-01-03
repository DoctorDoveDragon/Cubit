import React from 'react'
import cx from 'classnames'

export default function Button({
  children,
  variant = 'default',
  onClick,
  className,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'default'
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        {
          'bg-[var(--color-accent)] text-white hover:opacity-90': variant === 'primary',
          'bg-[rgba(124,58,237,0.1)] text-[var(--color-accent)] hover:bg-[rgba(124,58,237,0.2)]':
            variant === 'default',
        },
        className
      )}
    >
      {children}
    </button>
  )
}
