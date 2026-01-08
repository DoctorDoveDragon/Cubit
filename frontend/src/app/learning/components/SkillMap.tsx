'use client'

import React from 'react'

const skillLevels = [
  { level: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { level: 'intermediate', label: 'Intermediate', color: 'bg-blue-500' },
  { level: 'advanced', label: 'Advanced', color: 'bg-purple-500' },
  { level: 'expert', label: 'Expert', color: 'bg-orange-500' }
]

interface SkillMapProps {
  currentLevel?: string;
  trajectory?: Array<{ timestamp: string; level: string }>;
}

export default function SkillMap({ currentLevel = 'beginner', trajectory = [] }: SkillMapProps) {
  const currentIndex = skillLevels.findIndex(s => s.level === currentLevel)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Your Skill Journey</h3>
      
      {/* Skill progression bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          {skillLevels.map((skill, index) => (
            <div key={skill.level} className="flex-1 text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                index <= currentIndex ? skill.color : 'bg-gray-300'
              } text-white font-bold`}>
                {index + 1}
              </div>
              <div className={`text-xs mt-2 ${
                index === currentIndex ? 'font-semibold' : 'text-gray-600'
              }`}>
                {skill.label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="relative h-2 bg-gray-200 rounded-full mt-4">
          <div
            className="absolute h-2 bg-gradient-to-r from-green-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / skillLevels.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Trajectory */}
      {trajectory.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Recent Progress</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {trajectory.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 text-xs">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-medium capitalize">{entry.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
