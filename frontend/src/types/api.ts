/**
 * API type definitions for the Cubit backend
 */

export interface ExecuteRequest {
  code: string
  teaching_enabled?: boolean
  verbosity?: 'minimal' | 'normal' | 'detailed'
}

export interface GameExecuteRequest {
  game: string
  code: string
  options?: Record<string, unknown>
  teaching_enabled?: boolean
  verbosity?: 'minimal' | 'normal' | 'detailed'
}

export interface Progress {
  total_calls: number
  method_diversity: string[]
  mastered_concepts?: string[]
}

export interface Shape {
  type: 'circle' | 'square' | 'triangle'
  x: number
  y: number
  size: number
  color: string
}

export interface ExecuteResponse {
  output: string | null
  result: unknown
  error: string | null
  skill_level?: string
  progress?: Progress
  suggestions?: string[]
  shapes?: Shape[]
}

export interface Game {
  title: string
  description: string
  instructions: string
  starter: string
  solution: string
}

export interface GamesResponse {
  games: Game[]
  error?: string
}

export interface ConceptGraph {
  concepts: {
    beginner: string[]
    intermediate: string[]
    advanced: string[]
  }
  graph: {
    [key: string]: {
      prerequisites: string[]
      difficulty: string
    }
  }
}

export interface ModuleStatus {
  name: string
  status: 'active' | 'inactive' | 'error'
  version?: string
  details?: string
}

export interface DebugExecuteResponse {
  success: boolean
  output?: string
  error?: string
  debugInfo?: {
    executionTime?: number
    memoryUsage?: number
    steps?: string[]
  }
}
