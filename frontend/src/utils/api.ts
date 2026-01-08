/**
 * API client for the Cubit backend with pedagogical features
 */

import { safeErrorMessage } from './safeError'

// Re-export all types from the types file for convenience
export type {
  ExecuteRequest,
  ExecuteResponse,
  GameExecuteRequest,
  ConceptGraph,
  GamesResponse,
  Game,
  Progress,
  ModuleStatusResponse,
  DebugExecuteResponse,
  Module,
  ModuleMetrics,
  ExecutionStep,
  Shape,
  ProgressResponse
} from '@/types/api'

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
 * Alias for getConceptGraph for consistency
 */
export async function getConcepts(): Promise<ConceptGraph> {
  return getConceptGraph()
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
 * Get module status information
 */
export async function getModuleStatus(): Promise<ModuleStatusResponse> {
  const apiUrl = getApiBaseUrl()
  
  try {
    const response = await fetch(`${apiUrl}/api/modules/status`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  } catch (error: unknown) {
    const errorMessage = safeErrorMessage(error)
    // Return fallback data structure
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
 * Execute code with step-by-step debugging information
 * @param request - The execution request
 * @returns Promise with debug execution results including steps
 */
export async function executeDebug(request: ExecuteRequest): Promise<DebugExecuteResponse> {
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
      final_result: {
        output: null,
        result: null,
        error: isNetworkError(error)
          ? `Unable to connect to the backend API at ${apiUrl}. Please ensure the backend is running.`
          : errorMessage,
        skill_level: 'beginner',
        progress: {},
        suggestions: []
      },
      total_duration_ms: 0
    }
  }
}
