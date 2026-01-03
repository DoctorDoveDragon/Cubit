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
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  }
  return 'http://localhost:8080'
}

/**
 * Execute Cubit code via the backend API
 * @param code - The Cubit code to execute
 * @returns Promise with execution results
 */
export async function executeCode(code: string): Promise<ExecuteResponse> {
  const apiUrl = getApiBaseUrl()
  
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
    // Network or parsing error
    return {
      output: null,
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Check if the API server is healthy
 */
export async function checkApiHealth(): Promise<boolean> {
  const apiUrl = getApiBaseUrl()
  
  try {
    const response = await fetch(`${apiUrl}/health`)
    return response.ok
  } catch {
    return false
  }
}
