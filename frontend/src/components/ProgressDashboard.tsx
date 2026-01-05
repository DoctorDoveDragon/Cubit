'use client'

import React, { useState, useEffect } from 'react'
import Button from './Button'
import { getProgress, getConceptGraph, ConceptGraph } from '../utils/api'
import { safeErrorMessage } from '../utils/safeError'

export default function ProgressDashboard() {
    const [progress, setProgress] = useState<{ message: string; info: string } | null>(null)
    const [concepts, setConcepts] = useState<ConceptGraph | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

    const loadProgress = async () => {
        setLoading(true)
        setError(null)
        try {
            const progressData = await getProgress()
            setProgress(progressData)
        } catch (err: unknown) {
            setError(safeErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const loadConcepts = async () => {
        setLoading(true)
        setError(null)
        try {
            const conceptData = await getConceptGraph()
            setConcepts(conceptData)
        } catch (err: unknown) {
            setError(safeErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadConcepts()
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Learning Dashboard</h3>
                <Button
                    variant="secondary"
                    onClick={loadProgress}
                    disabled={loading}
                    className="text-sm"
                >
                    {loading ? 'Loading...' : 'Refresh Progress'}
                </Button>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                    <div className="text-sm text-red-400">{error}</div>
                </div>
            )}

            {/* Progress Information */}
            {progress && (
                <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Your Progress</h4>
                    <div className="space-y-2">
                        <div className="text-sm text-[var(--color-muted)]">{progress.message}</div>
                        {progress.info && (
                            <div className="text-xs text-[var(--color-muted)] bg-[var(--color-bg)] rounded p-2 font-mono whitespace-pre-wrap">
                                {progress.info}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Concept Browser */}
            {concepts && (
                <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Programming Concepts</h4>

                    {/* Difficulty Selector */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setSelectedDifficulty('beginner')}
                            className={`px-3 py-1 rounded text-sm transition-colors ${selectedDifficulty === 'beginner'
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                    : 'bg-[var(--color-bg)] text-[var(--color-muted)] border border-[rgba(255,255,255,0.12)]'
                                }`}
                        >
                            Beginner
                        </button>
                        <button
                            onClick={() => setSelectedDifficulty('intermediate')}
                            className={`px-3 py-1 rounded text-sm transition-colors ${selectedDifficulty === 'intermediate'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                    : 'bg-[var(--color-bg)] text-[var(--color-muted)] border border-[rgba(255,255,255,0.12)]'
                                }`}
                        >
                            Intermediate
                        </button>
                        <button
                            onClick={() => setSelectedDifficulty('advanced')}
                            className={`px-3 py-1 rounded text-sm transition-colors ${selectedDifficulty === 'advanced'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                                    : 'bg-[var(--color-bg)] text-[var(--color-muted)] border border-[rgba(255,255,255,0.12)]'
                                }`}
                        >
                            Advanced
                        </button>
                    </div>

                    {/* Concepts List */}
                    <div className="space-y-2">
                        {concepts.concepts[selectedDifficulty].map((concept) => {
                            const details = concepts.graph[concept]
                            return (
                                <div
                                    key={concept}
                                    className="bg-[var(--color-bg)] border border-[rgba(255,255,255,0.12)] rounded-lg p-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{concept}</div>
                                            {details && details.prerequisites.length > 0 && (
                                                <div className="text-xs text-[var(--color-muted)] mt-1">
                                                    Prerequisites: {details.prerequisites.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                        {details && (
                                            <span className={`px-2 py-1 rounded text-xs ${details.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                                                    details.difficulty === 'intermediate' ? 'bg-blue-500/20 text-blue-300' :
                                                        'bg-purple-500/20 text-purple-300'
                                                }`}>
                                                {details.difficulty}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Help Text */}
            <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">How to Use Teaching Mode</h4>
                <ul className="text-sm text-[var(--color-muted)] space-y-1">
                    <li>• Enable <strong>Teaching Mode</strong> to receive real-time learning insights</li>
                    <li>• Choose <strong>Verbosity Level</strong> to control detail depth</li>
                    <li>• The system detects your <strong>Skill Level</strong> automatically</li>
                    <li>• Track your <strong>Progress</strong> with function calls and mastered concepts</li>
                    <li>• Get personalized <strong>Suggestions</strong> for next learning steps</li>
                </ul>
            </div>
        </div>
    )
}
