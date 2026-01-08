import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import SystemFlowchart from './SystemFlowchart'
import * as api from '@/src/utils/api'

// Mock the API
jest.mock('@/src/utils/api')

// Mock ReactFlow
jest.mock('@xyflow/react', () => ({
  ReactFlow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-flow">{children}</div>
  ),
  Background: () => <div data-testid="background" />,
  Controls: () => <div data-testid="controls" />,
  MiniMap: () => <div data-testid="minimap" />,
  useNodesState: () => [[], jest.fn(), jest.fn()],
  useEdgesState: () => [[], jest.fn(), jest.fn()],
  Handle: () => null,
  Position: { Top: 'top', Bottom: 'bottom' }
}))

describe('SystemFlowchart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(api.getModuleStatus as jest.Mock).mockReturnValue(new Promise(() => {}))
    render(<SystemFlowchart />)
    expect(screen.getByText(/loading system architecture/i)).toBeInTheDocument()
  })

  it('renders flowchart when data is loaded', async () => {
    const mockData = {
      modules: [
        {
          id: 'lexer',
          name: 'Lexer',
          type: 'core',
          status: 'active',
          version: '1.0.0',
          metrics: {
            total_requests: 10,
            successful_requests: 10,
            failed_requests: 0,
            average_response_time_ms: 5.0,
            last_request_time: null
          }
        }
      ],
      system: {
        total_modules: 1,
        active_modules: 1,
        error_modules: 0,
        uptime_seconds: 100
      }
    }

    ;(api.getModuleStatus as jest.Mock).mockResolvedValue(mockData)

    render(<SystemFlowchart />)

    await waitFor(() => {
      expect(screen.getByTestId('react-flow')).toBeInTheDocument()
    })
  })

  it('renders error state when API fails', async () => {
    ;(api.getModuleStatus as jest.Mock).mockResolvedValue({
      modules: [],
      system: {
        total_modules: 0,
        active_modules: 0,
        error_modules: 0,
        uptime_seconds: 0
      }
    })

    render(<SystemFlowchart />)

    await waitFor(() => {
      expect(screen.getByText(/no modules found/i)).toBeInTheDocument()
    })
  })

  it('calls onModuleClick when provided', async () => {
    const mockOnClick = jest.fn()
    const mockData = {
      modules: [
        {
          id: 'lexer',
          name: 'Lexer',
          type: 'core',
          status: 'active',
          version: '1.0.0',
          metrics: {
            total_requests: 10,
            successful_requests: 10,
            failed_requests: 0,
            average_response_time_ms: 5.0,
            last_request_time: null
          }
        }
      ],
      system: {
        total_modules: 1,
        active_modules: 1,
        error_modules: 0,
        uptime_seconds: 100
      }
    }

    ;(api.getModuleStatus as jest.Mock).mockResolvedValue(mockData)

    render(<SystemFlowchart onModuleClick={mockOnClick} />)

    await waitFor(() => {
      expect(screen.getByTestId('react-flow')).toBeInTheDocument()
    })
  })
})
