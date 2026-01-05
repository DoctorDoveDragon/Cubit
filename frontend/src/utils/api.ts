/**
 * API client for the Cubit backend with pedagogical features
 */

export interface ExecuteRequest {
  code: string
  teaching_enabled?: boolean
  verbosity?: 'minimal' | 'normal' | 'detailed'
}

export interface Progress {
  total_calls: number
  total_methods_used: number
  method_diversity: string[]
  mastered_concepts?: string[]
  skill_trajectory?: string[]
}

export interface ExecuteResponse {
  output: string | null
  result: unknown
  error: string | null
  teaching_moment?: {
    level?: string
    focus?: string
    explanation?: string
    why_it_exists?: string
    simple_analogy?: string
    prerequisites?: string[]
    related_concepts?: string[]
    pitfalls?: string[]
    best_practices?: string[]
    common_patterns?: string[]
    when_to_use?: string
    alternatives?: string[]
    performance_tips?: string[]
    advanced_patterns?: string[]
    theory?: string
    edge_cases?: string[]
    implementation_details?: string
    research_references?: string[]
  }
  skill_level?: string
  progress?: Progress
  suggestions?: string[]
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
