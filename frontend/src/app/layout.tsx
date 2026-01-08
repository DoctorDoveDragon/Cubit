import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cubit Intelligent GUI",
  description: "Interactive system for the Cubit programming language with backend integration",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-950">
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                Cubit
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href="/architecture"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Architecture
                </Link>
                <Link
                  href="/execution"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Execution
                </Link>
                <Link
                  href="/system"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  System
                </Link>
                <Link
                  href="/customize"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Customize
                </Link>
                <Link
                  href="/games"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Games
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

