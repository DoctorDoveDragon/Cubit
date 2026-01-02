import React from 'react'
import cx from 'classnames'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'ghost', className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cx(
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        variant === 'primary'
          ? 'bg-[var(--color-accent)] text-black shadow-sm'
          : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[rgba(255,255,255,0.02)]',
        className
      )}
    />
  )
}
