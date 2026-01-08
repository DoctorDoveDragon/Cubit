/**
 * Test setup for MSW (Mock Service Worker) handlers and test utilities
 */

// Derive API base from environment, making tests portable across local/CI
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// MSW handlers for API mocking
// Note: MSW should be installed as a dev dependency (npm install -D msw@latest)
// Handlers are defined here but MSW setup would typically happen in a jest/vitest config

/**
 * Mock API handlers for testing
 * Usage: Configure these with MSW's setupServer() in your test framework config
 */
export const handlers = [
  // Health check endpoint
  {
    url: `${API_BASE}/health`,
    method: 'GET',
    response: { status: 'ok' }
  },
  
  // Execute endpoint
  {
    url: `${API_BASE}/execute`,
    method: 'POST',
    response: {
      output: 'Test output',
      result: 42,
      error: null,
      skill_level: 'beginner',
      progress: {
        total_calls: 1,
        method_diversity: ['test'],
        mastered_concepts: []
      }
    }
  },
  
  // Module status endpoint
  {
    url: `${API_BASE}/modules/status`,
    method: 'GET',
    response: {
      modules: [
        {
          name: 'test-module',
          status: 'active' as const,
          version: '1.0.0'
        }
      ]
    }
  },
  
  // Debug execute endpoint
  {
    url: `${API_BASE}/debug/execute`,
    method: 'POST',
    response: {
      success: true,
      output: 'Debug output',
      debugInfo: {
        executionTime: 100,
        memoryUsage: 1024,
        steps: ['step1', 'step2']
      }
    }
  },
  
  // Games endpoint
  {
    url: `${API_BASE}/games`,
    method: 'GET',
    response: {
      games: [
        {
          title: 'Test Game',
          description: 'A test game',
          instructions: 'Test instructions',
          starter: 'print("hello")',
          solution: 'print("solution")'
        }
      ]
    }
  },
  
  // Games execute endpoint
  {
    url: `${API_BASE}/games/execute`,
    method: 'POST',
    response: {
      output: 'Game output',
      result: null,
      error: null,
      shapes: [
        {
          type: 'circle' as const,
          x: 100,
          y: 100,
          size: 50,
          color: '#ff0000'
        }
      ]
    }
  },
  
  // Concepts endpoint
  {
    url: `${API_BASE}/concepts`,
    method: 'GET',
    response: {
      concepts: {
        beginner: ['variables', 'functions'],
        intermediate: ['classes', 'modules'],
        advanced: ['decorators', 'metaclasses']
      },
      graph: {
        variables: {
          prerequisites: [],
          difficulty: 'beginner'
        },
        functions: {
          prerequisites: ['variables'],
          difficulty: 'beginner'
        }
      }
    }
  },
  
  // Progress endpoint
  {
    url: `${API_BASE}/progress`,
    method: 'GET',
    response: {
      message: 'Progress retrieved',
      info: 'Test progress info'
    }
  }
]

/**
 * ResizeObserver mock for testing components that use resize observation
 */
export class ResizeObserverMock {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
}

/**
 * Setup function to be called in test configuration
 * Example usage with Vitest:
 * 
 * ```ts
 * import { beforeAll, afterEach, afterAll } from 'vitest'
 * import { setupServer } from 'msw/node'
 * import { http, HttpResponse } from 'msw'
 * import { handlers } from './test/setup'
 * 
 * // Convert handler configs to MSW handlers
 * const mswHandlers = handlers.map(h => {
 *   const handler = h.method === 'GET' ? http.get : http.post
 *   return handler(h.url, () => HttpResponse.json(h.response))
 * })
 * 
 * const server = setupServer(...mswHandlers)
 * 
 * beforeAll(() => server.listen())
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 * ```
 */
export function setupTests() {
  // Setup ResizeObserver mock
  if (typeof global !== 'undefined') {
    global.ResizeObserver = ResizeObserverMock as any
  }
}

// Export API_BASE for use in tests
export { API_BASE }
