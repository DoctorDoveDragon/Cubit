'use client'

import React, { useEffect, useState } from 'react'
import Card from '@/src/components/Card'
import SkillMap from './components/SkillMap'
import ConceptExplorer from './components/ConceptExplorer'
import TeachingMoments from './components/TeachingMoments'
import { getProgress } from '@/src/utils/api'

export default function LearningPage() {
  const [progress, setProgress] = useState<{
    current_skill_level: string;
    skill_trajectory: Array<{ timestamp: string; level: string }>;
  }>({ current_skill_level: 'beginner', skill_trajectory: [] })

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await getProgress()
        if (data && typeof data === 'object' && 'current_skill_level' in data) {
          setProgress(data as never)
        }
      } catch (error) {
        console.error('Failed to load progress:', error)
      }
    }
    loadProgress()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your progress, explore concepts, and receive personalized teaching insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <SkillMap
              currentLevel={progress.current_skill_level}
              trajectory={progress.skill_trajectory}
            />
          </Card>

          <Card>
            <TeachingMoments />
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <ConceptExplorer />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
