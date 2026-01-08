'use client'

import React from 'react'

interface TeachingMoment {
  type: string;
  level: string;
  message: string;
  timestamp: string;
}

interface TeachingMomentsProps {
  moments?: TeachingMoment[];
}

export default function TeachingMoments({ moments = [] }: TeachingMomentsProps) {
  // Show placeholder if no moments
  const displayMoments = moments.length > 0 ? moments : [
    {
      type: 'tip',
      level: 'beginner',
      message: 'Execute code with teaching mode enabled to receive personalized learning insights.',
      timestamp: new Date().toISOString()
    }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'tip': return '💡'
      case 'warning': return '⚠️'
      case 'success': return '✅'
      case 'insight': return '🎓'
      default: return 'ℹ️'
    }
  }

  const getColorClass = (level: string) => {
    switch (level) {
      case 'beginner': return 'border-l-green-500'
      case 'intermediate': return 'border-l-blue-500'
      case 'advanced': return 'border-l-purple-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Teaching Moments</h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {displayMoments.map((moment, index) => (
          <div
            key={index}
            className={`border-l-4 ${getColorClass(moment.level)} bg-gray-50 p-4 rounded-r`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getIcon(moment.type)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-600 uppercase">
                    {moment.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(moment.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-800">{moment.message}</p>
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 bg-white rounded capitalize">
                    {moment.level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
