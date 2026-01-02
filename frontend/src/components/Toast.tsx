import React, { useEffect, useRef } from 'react'

export default function Toast({ message, onClose }: { message: string; onClose?: () => void }) {
  const onCloseRef = useRef(onClose)
  
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const t = setTimeout(() => {
      if (onCloseRef.current) {
        onCloseRef.current()
      }
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed right-6 bottom-6 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm text-white px-4 py-2 rounded-md shadow-lg">
      {message}
    </div>
  )
}
