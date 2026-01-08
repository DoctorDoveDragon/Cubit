/**
 * API client for the Cubit backend with pedagogical features
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

/**
 * Get API base URL from environment or default to localhost
 */
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side - in production, use relative URLs since Next.js proxies to backend
    // In development, check for environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      // In production deployment (monorepo), use empty string for relative URLs
      // The Next.js server will proxy these to the backend via rewrites
      if (process.env.NODE_ENV === 'production') {
        return ''  // Relative URLs - Next.js will proxy to backend
      }
      console.warn('NEXT_PUBLIC_API_URL is not set. Using default: http://localhost:8080')
      return 'http://localhost:8080'
    }
    return apiUrl
  }
  return 'http://localhost:8080'
}

/**
 * Sleep utility for retry logic
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Check if error is a network-related error
 */
const isNetworkError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    // TypeError is commonly thrown for network failures in fetch
    return true
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return message.includes('fetch') ||
      message.includes('network') ||
      message.includes('failed to fetch') ||
      message.includes('networkerror') ||
      message.includes('connection')
  }
  return false
}

/**
 * Execute Cubit code via the backend API with retry logic and pedagogical features
 * @param request - The execution request with code and optional teaching settings
 * @param retries - Number of retries (default: 2)
 * @returns Promise with execution results
 */
import { safeErrorMessage } from './safeError'

export async function executeCode(request: ExecuteRequest, retries: number = 2): Promise<ExecuteResponse> {
  const apiUrl = getApiBaseUrl()
  let lastError: unknown = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${apiUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ExecuteResponse = await response.json()
      return data
    } catch (error: unknown) {
      lastError = error

      // If this is the last attempt, return error response
      if (attempt === retries) {
        break
      }

      // Wait before retrying (exponential backoff)
      await sleep(Math.pow(2, attempt) * 500)
    }
  }

  // Return error response after all retries failed
  const errorMessage = safeErrorMessage(lastError)
  return {
    output: null,
    result: null,
    error: isNetworkError(lastError)
      ? `Unable to connect to the backend API at ${apiUrl}. Please ensure the backend is running and NEXT_PUBLIC_API_URL is set correctly.`
      : errorMessage
  }
}

/**
 * Check if the API server is healthy
 */
export async function checkApiHealth(): Promise<boolean> {
  const apiUrl = getApiBaseUrl()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${apiUrl}/health`, {
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get concept graph and suggestions
 */
export async function getConceptGraph(): Promise<ConceptGraph> {
  const apiUrl = getApiBaseUrl()
  const response = await fetch(`${apiUrl}/concepts`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Get learning progress information
 */
export async function getProgress(): Promise<{ message: string; info: string }> {
  const apiUrl = getApiBaseUrl()
  const response = await fetch(`${apiUrl}/progress`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Get list of available games
 */
export async function getGames(): Promise<GamesResponse> {
  const apiUrl = getApiBaseUrl()
  
  try {
    const response = await fetch(`${apiUrl}/games`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  } catch (error: unknown) {
    const errorMessage = safeErrorMessage(error)
    return {
      games: [],
      error: isNetworkError(error)
        ? `Unable to connect to the backend API at ${apiUrl}. Please ensure the backend is running.`
        : errorMessage
    }
  }
}

/**
 * Execute game code via the backend API
 * @param request - The game execution request
 * @returns Promise with execution results including shapes for visualization
 */
export async function executeGameCode(request: GameExecuteRequest): Promise<ExecuteResponse> {
  const apiUrl = getApiBaseUrl()
  
  try {
    const response = await fetch(`${apiUrl}/games/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data: ExecuteResponse = await response.json()
    return data
  } catch (error: unknown) {
    const errorMessage = safeErrorMessage(error)
    return {
      output: null,
      result: null,
      shapes: [],
      error: isNetworkError(error)
        ? `Unable to connect to the backend API at ${apiUrl}. Please ensure the backend is running.`
        : errorMessage
    }
  }
}

/**
 * Get modules status from the backend
 * @returns Promise with modules and system status
 */
export async function getModuleStatus(): Promise<{
  modules: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    version: string;
    metrics: Record<string, unknown>;
  }>;
  system: {
    total_modules: number;
    active_modules: number;
    error_modules: number;
    uptime_seconds: number;
  };
}> {
  const apiUrl = getApiBaseUrl()
  
  try {
    const response = await fetch(`${apiUrl}/api/modules/status`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  } catch (error: unknown) {
    console.error('Failed to fetch module status:', error)
    return {
      modules: [],
      system: {
        total_modules: 0,
        active_modules: 0,
        error_modules: 0,
        uptime_seconds: 0
      }
    }
  }
}

/**
 * Execute code with debug instrumentation
 * @param request - The execution request
 * @returns Promise with debug steps and execution result
 */
export async function executeDebug(request: ExecuteRequest): Promise<{
  steps: Array<{
    id: string;
    module: string;
    timestamp: string;
    duration_ms: number;
    input: string | Record<string, unknown>;
    output: Record<string, unknown>;
    status: string;
    error?: string;
  }>;
  result: {
    output: string | null;
    result: unknown;
    error: string | null;
    skill_level: string;
    progress: Record<string, unknown>;
    suggestions: string[];
  };
}> {
  const apiUrl = getApiBaseUrl()
  
  try {
    const response = await fetch(`${apiUrl}/api/execute/debug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  } catch (error: unknown) {
    const errorMessage = safeErrorMessage(error)
    return {
      steps: [],
      result: {
        output: null,
        result: null,
        error: isNetworkError(error)
          ? `Unable to connect to the backend API at ${apiUrl}. Please ensure the backend is running.`
          : errorMessage,
        skill_level: 'beginner',
        progress: {},
        suggestions: []
      }
    }
  }
}

/**
 * Get concept suggestions and graph
 * @returns Promise with concept information
 */
export async function getConcepts(): Promise<{
  concepts: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  graph: Record<string, {
    prerequisites: string[];
    difficulty: string;
  }>;
}> {
  const apiUrl = getApiBaseUrl()
  
  try {
    const response = await fetch(`${apiUrl}/concepts`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  } catch (error: unknown) {
    console.error('Failed to fetch concepts:', error)
    return {
      concepts: {
        beginner: [],
        intermediate: [],
        advanced: []
      },
      graph: {}
    }
  }
}
