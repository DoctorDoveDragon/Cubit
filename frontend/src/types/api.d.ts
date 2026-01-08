/**
 * API type definitions for Cubit backend
 * These types match the backend API responses from api.py
 */

export interface ModuleMetrics {
  total_requests: number
  successful_requests: number
  failed_requests: number
  avg_response_time_ms: number
  last_request_time?: string
}

export interface Module {
  id: string
  name: string
  type: 'core' | 'pedagogical' | 'game' | 'api'
  status: 'active' | 'error' | 'inactive'
  version: string
  metrics: ModuleMetrics
}

export interface ModuleStatusResponse {
  modules: Module[]
  system: {
    total_modules: number
    active_modules: number
    error_modules: number
    uptime_seconds: number
  }
}

export interface ExecutionStep {
  id: string
  module: string
  timestamp: string
  duration_ms: number
  input: string | Record<string, unknown>
  output: Record<string, unknown>
  status: 'completed' | 'error'
  error?: string
}

export interface DebugExecuteResponse {
  steps: ExecutionStep[]
  final_result: {
    output: string | null
    result: unknown
    error: string | null
    skill_level: string
    progress: Record<string, unknown>
    suggestions: string[]
  }
  total_duration_ms: number
}

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

export interface ProgressResponse {
  total_calls: number
  method_diversity: string[]
  mastered_concepts: string[]
  current_skill_level: string
  session_info: string
  skill_trajectory: Array<{
    timestamp: string
    level: string
  }>
}
