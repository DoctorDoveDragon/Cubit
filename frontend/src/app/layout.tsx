import type { Metadata } from "next"
import "./globals.css"
import Navigation from "../components/Navigation"

export const metadata: Metadata = {
  title: "Cubit - Intelligent GUI System",
  description: "Interactive learning environment for Cubit programming language",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  )
}
