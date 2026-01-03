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
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cubit Design System",
  description: "Designer-focused component scaffold for Cubit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
