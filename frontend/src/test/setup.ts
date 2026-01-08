import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock module status data
const mockModuleStatus = {
  modules: [
    {
      id: 'lexer',
      name: 'Lexer',
      type: 'core',
      status: 'active',
      version: '1.0.0',
      metrics: {
        total_requests: 150,
        successful_requests: 148,
        failed_requests: 2,
        avg_response_time_ms: 12.5,
      }
    },
  ],
  system: {
    total_modules: 11,
    active_modules: 11,
    error_modules: 0,
    uptime_seconds: 3600
  }
}

// Mock debug execution data
const mockDebugExecution = {
  steps: [
    {
      id: 'lexer-001',
      module: 'lexer',
      timestamp: new Date().toISOString(),
      duration_ms: 12.5,
      input: 'x = 5',
      output: { tokens: ['IDENTIFIER(x)', 'ASSIGN', 'NUMBER(5)'] },
      status: 'completed'
    },
  ],
  final_result: {
    output: '15\n',
    result: null,
    error: null,
    skill_level: 'beginner',
    progress: {},
    suggestions: []
  },
  total_duration_ms: 45.7
}

// Setup MSW server
export const server = setupServer(
  http.get('http://localhost:8080/api/modules/status', () => {
    return HttpResponse.json(mockModuleStatus)
  }),
  http.get('http://localhost:8080/health', () => {
    return HttpResponse.json({ status: 'healthy' })
  }),
  http.post('http://localhost:8080/api/execute/debug', () => {
    return HttpResponse.json(mockDebugExecution)
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
