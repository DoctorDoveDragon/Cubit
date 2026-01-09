'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SettingsPanel from '../components/SettingsPanel'
import CubitMascot from '../components/CubitMascot'
import DeveloperModeToggle from '../components/DeveloperModeToggle'
import { useDeveloperMode } from '../hooks/useDeveloperMode'
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
import { motion, AnimatePresence } from 'framer-motion'
import { FiSettings, FiBook, FiZap } from 'react-icons/fi'
const ChallengeTabs = dynamic(() => import('../course/ChallengeTabs'), { ssr: false })
const GameTabs = dynamic(() => import('../course/GameTabs'), { ssr: false })
const FunctionExplorer = dynamic(() => import('../course/FunctionExplorer'), { ssr: false })


export default function MainPage() {
  const router = useRouter()
  const { isDeveloperMode, isLoaded } = useDeveloperMode()
  const [generated, setGenerated] = useState<string>('');
  const [showCreativePanel, setShowCreativePanel] = useState<boolean>(false);
  const [showProgressDashboard, setShowProgressDashboard] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [mascotMessage, setMascotMessage] = useState<string>('Welcome to Cubit! Let\'s learn to code! 🚀');
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging'>('happy');

  // Redirect to developer mode if enabled
  useEffect(() => {
    if (isLoaded && isDeveloperMode) {
      router.push('/developer')
    }
  }, [isDeveloperMode, isLoaded, router])

  // Don't render until preferences are loaded
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Header />
        
        {/* Action Buttons */}
        <div className="flex justify-end mb-4 gap-2 flex-wrap">
          <DeveloperModeToggle />
          <Button 
            variant="secondary" 
            onClick={() => setShowSettings(!showSettings)}
            icon={<FiSettings />}
          >
            Settings
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setMascotMessage('Let\'s explore the full course! 📚')
              setMascotMood('excited')
            }}
            icon={<FiBook />}
          >
            Full Course
          </Button>
        </div>
        
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mt-4" gradient>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiSettings className="text-purple-600" />
                  Settings
                </h3>
                <SettingsPanel />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Cubit Course Tabs - always visible at the top */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CourseTabs />
        </motion.div>


        {/* Cubit Challenge Tabs - interactive code puzzles */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ChallengeTabs />
        </motion.div>


        {/* Cubit Game Tabs - fun, visually rich games */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GameTabs />
        </motion.div>

        {/* Cubit Function Explorer - all built-in functions */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FunctionExplorer />
        </motion.div>

        <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Start & Commands */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.4 }}
          >
            <Card gradient>
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                🚀 Quick Start
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Start your coding journey with Cubit! Learn through play and create amazing things! ✨
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setMascotMessage('Great! Let\'s start coding! 🎉')
                    setMascotMood('celebrating')
                  }}
                  icon="🎯"
                >
                  Start Learning
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                  icon="⚡"
                >
                  Try Examples
                </Button>
              </div>
            </Card>

            <Card className="mt-4">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiZap className="text-purple-600" />
                Quick Commands
              </h4>
              <CommandsPanel onGenerate={(t) => setGenerated(t)} />
            </Card>

            <Card className="mt-4" gradient>
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎨 Design Tokens</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-purple-400"></span>
                  Colors • Purple, Pink, Blue
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></span>
                  Gradients • Smooth transitions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-2xl bg-white border-2 border-purple-300"></span>
                  Radius • Extra rounded corners
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* Middle Column - Code Executor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FiZap className="text-purple-600" />
                  Code Playground 🎮
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowProgressDashboard(!showProgressDashboard)
                      if (!showProgressDashboard) {
                        setMascotMessage('Let\'s check your progress! 📊')
                        setMascotMood('excited')
                      }
                    }}
                  >
                    {showProgressDashboard ? '📊 Hide' : '📊 Show'} Progress
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowCreativePanel(!showCreativePanel)
                      if (!showCreativePanel) {
                        setMascotMessage('Explore creative commands! 🎨')
                        setMascotMood('happy')
                      }
                    }}
                  >
                    {showCreativePanel ? '🎨 Hide' : '🎨 Show'} Creative
                  </Button>
                </div>
              </div>
              <ErrorBoundary>
                <CodeExecutor />
              </ErrorBoundary>
            </Card>
            
            {generated && (
              <Card className="mt-4" gradient>
                <h3 className="text-lg font-bold text-gray-800 mb-2">✨ Generated Output</h3>
                <div className="bg-white/80 p-4 rounded-xl border-2 border-purple-200">
                  <strong className="text-purple-700">Result:</strong>
                  <div className="mt-2 text-gray-700">{generated}</div>
                </div>
              </Card>
            )}

            {/* Creative Commands Panel (Collapsible) */}
            <AnimatePresence>
              {showCreativePanel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mt-4" gradient>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🎨 Creative Commands</h3>
                    <CreativeCommandsPanel />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Dashboard (Collapsible) */}
            <AnimatePresence>
              {showProgressDashboard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mt-4" gradient>
                    <ProgressDashboard />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="mt-4" gradient>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                📖 How to Use Cubit
              </h3>
              <ol className="text-sm text-gray-700 list-decimal list-inside space-y-3">
                <li>✏️ Write or select Cubit code from the examples dropdown</li>
                <li>🎓 Enable <strong className="text-purple-700">Teaching Mode</strong> to receive learning insights</li>
                <li>▶️ Click "Run Code" to execute and see visual output</li>
                <li>📊 View output, skill level, and progress in real-time</li>
                <li>🏆 Use "Show Progress" to view your learning dashboard</li>
                <li>🎨 Use "Show Creative" to access AI features</li>
                <li>⚙️ Adjust verbosity level for more or less detail</li>
              </ol>
            </Card>
          </motion.div>
        </main>
        
        {/* Cubit Mascot - Always visible */}
        <CubitMascot 
          mood={mascotMood}
          message={mascotMessage}
          show={true}
        />
      </div>
    </div>
  );
}
