'use client'

import React, { useState, useEffect } from 'react'
import { getGames, type Game } from '../../utils/api'
import dynamic from 'next/dynamic'
import Card from '../../components/Card'
import Button from '../../components/Button'

// Dynamically import game components to avoid SSR issues
const AnimatedArt = dynamic(() => import('../../components/games/AnimatedArt'), { ssr: false })
const GraphingCalculator = dynamic(() => import('../../components/games/GraphingCalculator'), { ssr: false })
const ComputationalGeometry = dynamic(() => import('../../components/games/ComputationalGeometry'), { ssr: false })
const Flowchart = dynamic(() => import('../../components/games/Flowchart'), { ssr: false })

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  useEffect(() => {
    async function loadGames() {
      try {
        const response = await getGames()
        if (response.error) {
          setError(response.error)
        } else {
          setGames(response.games)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }
    
    loadGames()
  }, [])

  const renderGameComponent = () => {
    switch (selectedGame) {
      case 'Animated Art':
        return <AnimatedArt />
      case 'Graphing Calculator':
        return <GraphingCalculator />
      case 'Computational Geometry':
      case 'STEM Project: Solar System':
        return <ComputationalGeometry />
      case 'Flowchart':
      case 'Treasure Hunt':
      case 'Code Race':
        return <Flowchart />
      default:
        return null
    }
  }

  if (selectedGame) {
    return (
      <div className="min-h-screen p-6 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{selectedGame}</h1>
            <Button onClick={() => setSelectedGame(null)}>← Back to Games</Button>
          </div>
          <Card>
            {renderGameComponent()}
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Cubit Games & Visualizations</h1>
        <p className="text-center text-[var(--color-muted)] mb-8">
          Interactive coding games and visual programming experiences
        </p>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
            <p className="mt-4 text-[var(--color-muted)]">Loading games...</p>
          </div>
        )}

        {error && (
          <Card className="bg-red-900/20 border-red-500">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Games</h3>
            <p className="text-sm text-red-300">{error}</p>
            <p className="text-xs text-[var(--color-muted)] mt-2">
              Make sure the backend server is running at the configured API URL.
            </p>
          </Card>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <Card key={index} className="hover:border-[var(--color-accent)] transition-all cursor-pointer">
                <div onClick={() => setSelectedGame(game.title)}>
                  <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] mb-3">{game.description}</p>
                  <p className="text-xs text-[var(--color-accent)] mb-4">{game.instructions}</p>
                  <Button variant="primary" className="w-full">
                    Open {game.title}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <Card>
            <p className="text-center text-[var(--color-muted)]">No games available</p>
          </Card>
        )}
      </div>
    </div>
  )
}
