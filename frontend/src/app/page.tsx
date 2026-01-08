'use client'

import React, { useState } from 'react'
import TabbedHeader, { TabId } from '../components/TabbedHeader'
import CodeEditorPage from '../components/CodeEditorPage'
import VisualFlowchartPage from '../components/VisualFlowchartPage'
import CodeAnalysisPage from '../components/CodeAnalysisPage'
import LearningPage from '../components/LearningPage'
import SettingsPage from '../components/SettingsPage'
import Sidebar from '../components/Sidebar'
import ErrorBoundary from '../components/ErrorBoundary'
import dynamic from 'next/dynamic'

// Dynamic imports for heavy components
const CourseTabs = dynamic(() => import('../course/CourseTabs'), { ssr: false })
const ChallengeTabs = dynamic(() => import('../course/ChallengeTabs'), { ssr: false })
const GameTabs = dynamic(() => import('../course/GameTabs'), { ssr: false })
const FunctionExplorer = dynamic(() => import('../course/FunctionExplorer'), { ssr: false })

export default function MainPage() {
  const [activeTab, setActiveTab] = useState<TabId>('code-editor')

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'code-editor':
        return <CodeEditorPage />
      case 'visual-flowchart':
        return <VisualFlowchartPage />
      case 'code-analysis':
        return <CodeAnalysisPage />
      case 'learning':
        return <LearningPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <CodeEditorPage />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TabbedHeader activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <ErrorBoundary>
              {renderTabContent()}
            </ErrorBoundary>

            {/* Educational Content - Always visible at bottom */}
            <div className="mt-12 space-y-10">
              <div className="border-t border-[rgba(255,255,255,0.12)] pt-10">
                <h2 className="text-2xl font-bold mb-6">Cubit Learning Resources</h2>
                
                {/* Cubit Course Tabs */}
                <div className="mb-10">
                  <CourseTabs />
                </div>

                {/* Cubit Challenge Tabs */}
                <div className="mb-10">
                  <ChallengeTabs />
                </div>

                {/* Cubit Game Tabs */}
                <div className="mb-10">
                  <GameTabs />
                </div>

                {/* Cubit Function Explorer */}
                <div className="mb-10">
                  <FunctionExplorer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
