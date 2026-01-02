import '../styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'Cubit — Designer UI',
  description: 'Prototype UI for Cubit'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[var(--color-bg)]">
          {children}
        </div>
      </body>
    </html>
  )
}
