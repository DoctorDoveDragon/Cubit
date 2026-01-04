'use client'

import React, { useState } from 'react'
import SettingsPanel from '../components/SettingsPanel'
import dynamic from 'next/dynamic'
const CourseTabs = dynamic(() => import('../course/CourseTabs'), { ssr: false })

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import CommandsPanel from '../components/CommandsPanel'
import CodeExecutor from '../components/CodeExecutor'
import CreativeCommandsPanel from '../components/CreativeCommandsPanel'
import ProgressDashboard from '../components/ProgressDashboard'
import ErrorBoundary from '../components/ErrorBoundary'
import { motion } from 'framer-motion'
const ChallengeTabs = dynamic(() => import('../course/ChallengeTabs'), { ssr: false })
const GameTabs = dynamic(() => import('../course/GameTabs'), { ssr: false })
const FunctionExplorer = dynamic(() => import('../course/FunctionExplorer'), { ssr: false })


export default function MainPage() {
  const [generated, setGenerated] = useState<string>('');
  const [showCreativePanel, setShowCreativePanel] = useState<boolean>(false);
  const [showProgressDashboard, setShowProgressDashboard] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Header />
        <div className="flex justify-end mb-2 gap-2">
          <Button variant="secondary" onClick={() => setShowSettings(!showSettings)} className="text-xs">
            {showSettings ? 'Hide' : 'Show'} Settings
          </Button>
          <Button variant="primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs">
            Cubit Full Course
          </Button>
        </div>
        {/* Settings Panel (Modal/Card) */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <SettingsPanel />
            </Card>
          </motion.div>
        )}


        {/* Cubit Course Tabs - always visible at the top */}
        <div className="mb-10">
          <CourseTabs />
        </div>


        {/* Cubit Challenge Tabs - interactive code puzzles */}
        <div className="mb-10">
          <ChallengeTabs />
        </div>


        {/* Cubit Game Tabs - fun, visually rich games */}
        <div className="mb-10">
          <GameTabs />
        </div>

        {/* Cubit Function Explorer - all built-in functions */}
        <div className="mb-10">
          <FunctionExplorer />
        </div>

        <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Overview & Commands */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <h3 className="text-lg font-semibold mb-2">Project overview</h3>
              <p className="text-sm text-[var(--color-muted)]">A clean canvas for designers — tokens, components, and Storybook included.</p>
              <div className="mt-4 flex gap-3">
                <Button variant="primary" onClick={() => alert('Starter scaffold — open Storybook to explore components')}>Get started</Button>
                <Button onClick={() => window.open('https://www.figma.com/', '_blank')}>Open Figma</Button>
              </div>
            </Card>

            <Card className="mt-4">
              <h4 className="font-medium mb-2">Commands</h4>
              <CommandsPanel onGenerate={(t) => setGenerated(t)} />
            </Card>

            <Card className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Tokens</h3>
              <ul className="text-sm text-[var(--color-muted)] space-y-1">
                <li>Spacing • 8 / 16 / 24</li>
                <li>Radius • 8 / 12</li>
                <li>Typography • Inter / system fonts</li>
              </ul>
            </Card>
          </motion.div>

          {/* Middle Column - Code Executor */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Cubit Code Executor</h3>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setShowProgressDashboard(!showProgressDashboard)}
                    className="text-xs"
                  >
                    {showProgressDashboard ? 'Hide' : 'Show'} Progress
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowCreativePanel(!showCreativePanel)}
                    className="text-xs"
                  >
                    {showCreativePanel ? 'Hide' : 'Show'} Creative Commands
                  </Button>
                </div>
              </div>
              <ErrorBoundary>
                <CodeExecutor />
              </ErrorBoundary>
            </Card>
            {generated && (
              <Card className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Generated Output</h3>
                <div className="bg-[var(--color-surface)] p-3 rounded-md text-sm text-[var(--color-muted)]">
                  <strong className="text-white">Result:</strong>
                  <div className="mt-2">{generated}</div>
                </div>
              </Card>
            )}

            {/* Creative Commands Panel (Collapsible) */}
            {showCreativePanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mt-4">
                  <h3 className="text-lg font-semibold mb-4">Creative Commands</h3>
                  <CreativeCommandsPanel />
                </Card>
              </motion.div>
            )}

            {/* Progress Dashboard (Collapsible) */}
            {showProgressDashboard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mt-4">
                  <ProgressDashboard />
                </Card>
              </motion.div>
            )}

            <Card className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              {/* eslint-disable react/no-unescaped-entities -- instructional text contains quoted labels */}
              <ol className="text-sm text-[var(--color-muted)] list-decimal list-inside space-y-2">
                <li>Write or select Cubit code from the examples dropdown</li>
                <li>Enable <strong className="text-white">Teaching Mode</strong> to receive learning insights</li>
                <li>Click "Run Code" to execute it via the backend API</li>
                <li>View output, skill level, progress, and suggestions in real-time</li>
                <li>Use "Show Progress" to view your learning dashboard and concept explorer</li>
                <li>Use "Show Creative Commands" to access AI features and code intelligence</li>
                <li>Adjust verbosity level to control the depth of teaching explanations</li>
              </ol>
              {/* eslint-enable react/no-unescaped-entities */}
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
