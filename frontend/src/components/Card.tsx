import React from 'react'
import cx from 'classnames'

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx('card', className)}>
      {children}
    </div>
  )
}
