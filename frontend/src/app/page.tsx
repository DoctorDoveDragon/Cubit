import React from 'react'
'use client'

import React, { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import { motion } from 'framer-motion'

export default function Page() {
import CommandsPanel from '../components/CommandsPanel'
import { motion } from 'framer-motion'

export default function Page() {
  const [generated, setGenerated] = useState<string>('')

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <main className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <h3 className="text-lg font-semibold mb-2">Project overview</h3>
              <p className="text-sm text-[var(--color-muted)]">A clean canvas for designers — tokens, components, and Storybook included.</p>
              <div className="mt-4 flex gap-3">
                <Button variant="primary">Get started</Button>
                <Button>Open Figma</Button>
              </div>
            </Card>
                <Button variant="primary" onClick={() => alert('Starter scaffold — open Storybook to explore components')}>Get started</Button>
                <Button onClick={() => window.open('https://www.figma.com/', '_blank')}>Open Figma</Button>
              </div>
            </Card>

            <Card className="mt-4">
              <h4 className="font-medium mb-2">Commands</h4>
              <CommandsPanel onGenerate={(t) => setGenerated(t)} />
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Card>
              <h3 className="text-lg font-semibold mb-2">Live preview</h3>
              <div className="h-28 rounded-md bg-gradient-to-br from-[rgba(124,58,237,0.12)] to-transparent flex items-center justify-center text-[var(--color-muted)]">
                Canvas preview
              </div>
              {generated && (
                <div className="mt-4 bg-[var(--color-surface)] p-3 rounded-md text-sm text-[var(--color-muted)]">
                  <strong className="text-white">Generated output:</strong>
                  <div className="mt-2">{generated}</div>
                </div>
              )}
            </Card>

            <Card className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              <ol className="text-sm text-[var(--color-muted)] list-decimal list-inside space-y-2">
                <li>Use the "Generate description" button to simulate creating content from a prompt. The result appears in the Live preview card.</li>
                <li>Click "Export tokens" to copy CSS tokens to your clipboard (for designers to import into tools).</li>
                <li>"Open Figma" opens Figma in a new tab — replace the URL with your file link if desired.</li>
                <li>Use "Toggle theme" to switch between a light and dark token set.</li>
              </ol>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <Card>
              <h3 className="text-lg font-semibold mb-2">Tokens</h3>
              <ul className="text-sm text-[var(--color-muted)] space-y-1">
                <li>Spacing • 8 / 16 / 24</li>
                <li>Radius • 8 / 12</li>
                <li>Typography • Inter / system fonts</li>
              </ul>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
