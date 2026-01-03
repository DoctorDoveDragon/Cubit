import React, { useEffect } from 'react'

export default function Toast({ message, onClose }: { message: string; onClose?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed right-6 bottom-6 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm text-white px-4 py-2 rounded-md shadow-lg">
      {message}
    </div>
  )
}
