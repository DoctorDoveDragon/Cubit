import React from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import { motion } from 'framer-motion'

export default function Page() {
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
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Card>
              <h3 className="text-lg font-semibold mb-2">Live preview</h3>
              <div className="h-28 rounded-md bg-gradient-to-br from-[rgba(124,58,237,0.12)] to-transparent flex items-center justify-center text-[var(--color-muted)]">
                Canvas preview
              </div>
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
