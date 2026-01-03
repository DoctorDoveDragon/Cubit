/**
 * API client for the Cubit backend
 */

export interface ExecuteRequest {
  code: string
}

export interface ExecuteResponse {
  output: string | null
  result: any
  error: string | null
}

/**
 * Get API base URL from environment or default to localhost
 */
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side - check for environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_API_URL is not set. Using default: http://localhost:8080')
    }
    return apiUrl || 'http://localhost:8080'
  }
  return 'http://localhost:8080'
}

/**
 * Sleep utility for retry logic
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Execute Cubit code via the backend API with retry logic
 * @param code - The Cubit code to execute
 * @param retries - Number of retries (default: 2)
 * @returns Promise with execution results
 */
export async function executeCode(code: string, retries: number = 2): Promise<ExecuteResponse> {
  const apiUrl = getApiBaseUrl()
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${apiUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code } as ExecuteRequest)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ExecuteResponse = await response.json()
      return data
    } catch (error) {
      // If this is the last attempt, return error response
      if (attempt === retries) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network')
        
        return {
          output: null,
          result: null,
          error: isNetworkError 
            ? `Unable to connect to the backend API at ${apiUrl}. Please ensure the backend is running and NEXT_PUBLIC_API_URL is set correctly.`
            : errorMessage
        }
      }
      
      // Wait before retrying (exponential backoff)
      await sleep(Math.pow(2, attempt) * 500)
    }
  }
  
  // This should never be reached, but TypeScript needs it
  return {
    output: null,
    result: null,
    error: 'Unexpected error in retry logic'
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
