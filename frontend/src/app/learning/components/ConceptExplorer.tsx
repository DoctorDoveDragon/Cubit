'use client'

import React, { useEffect, useState } from 'react'
import { getConcepts } from '@/src/utils/api'

interface ConceptNode {
  prerequisites: string[];
  difficulty: string;
}

export default function ConceptExplorer() {
  const [concepts, setConcepts] = useState<{
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  }>({ beginner: [], intermediate: [], advanced: [] })
  
  const [graph, setGraph] = useState<Record<string, ConceptNode>>({})
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConcepts = async () => {
      try {
        const data = await getConcepts()
        setConcepts(data.concepts)
        setGraph(data.graph)
      } catch (error) {
        console.error('Failed to load concepts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadConcepts()
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading concepts...</div>
  }

  const selectedInfo = selectedConcept ? graph[selectedConcept] : null

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Programming Concepts</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <h4 className="font-medium text-green-700 mb-2">Beginner</h4>
          <div className="space-y-1">
            {concepts.beginner.map((concept) => (
              <button
                key={concept}
                onClick={() => setSelectedConcept(concept)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  selectedConcept === concept
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {concept}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-blue-700 mb-2">Intermediate</h4>
          <div className="space-y-1">
            {concepts.intermediate.map((concept) => (
              <button
                key={concept}
                onClick={() => setSelectedConcept(concept)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  selectedConcept === concept
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {concept}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-purple-700 mb-2">Advanced</h4>
          <div className="space-y-1">
            {concepts.advanced.map((concept) => (
              <button
                key={concept}
                onClick={() => setSelectedConcept(concept)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  selectedConcept === concept
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {concept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedInfo && selectedConcept && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">{selectedConcept}</h4>
          <div className="text-sm space-y-2">
            <div>
              <span className="text-gray-600">Difficulty:</span>{' '}
              <span className="font-medium capitalize">{selectedInfo.difficulty}</span>
            </div>
            {selectedInfo.prerequisites.length > 0 && (
              <div>
                <span className="text-gray-600">Prerequisites:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedInfo.prerequisites.map((prereq) => (
                    <span
                      key={prereq}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
