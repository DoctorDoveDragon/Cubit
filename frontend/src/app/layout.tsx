import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cubit Design System",
  description: "Designer-focused component scaffold for Cubit",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
