import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ExecutionTimeline from './ExecutionTimeline'
import * as api from '@/src/utils/api'

// Mock the API
jest.mock('@/src/utils/api')

describe('ExecutionTimeline', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component with initial state', () => {
    render(<ExecutionTimeline />)
    expect(screen.getByText(/code to debug/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /execute with debug/i })).toBeInTheDocument()
  })

  it('allows code input', () => {
    render(<ExecutionTimeline />)
    const textarea = screen.getByPlaceholderText(/enter cubit code/i)
    fireEvent.change(textarea, { target: { value: 'x = 10' } })
    expect(textarea).toHaveValue('x = 10')
  })

  it('executes code and displays steps', async () => {
    const mockData = {
      steps: [
        {
          id: 'lexer-001',
          module: 'lexer',
          timestamp: new Date().toISOString(),
          duration_ms: 5.0,
          input: 'x = 5',
          output: { tokens: ['IDENTIFIER(x)', 'EQUALS', 'NUMBER(5)'] },
          status: 'completed'
        }
      ],
      result: {
        output: '5',
        result: null,
        error: null,
        skill_level: 'beginner',
        progress: {},
        suggestions: []
      }
    }

    ;(api.executeDebug as jest.Mock).mockResolvedValue(mockData)

    render(<ExecutionTimeline />)
    
    const button = screen.getByRole('button', { name: /execute with debug/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/execution steps/i)).toBeInTheDocument()
    })

    expect(screen.getByText('lexer')).toBeInTheDocument()
    expect(screen.getByText('completed')).toBeInTheDocument()
  })

  it('disables button when code is empty', () => {
    render(<ExecutionTimeline />)
    const textarea = screen.getByPlaceholderText(/enter cubit code/i)
    fireEvent.change(textarea, { target: { value: '' } })
    
    const button = screen.getByRole('button', { name: /execute with debug/i })
    expect(button).toBeDisabled()
  })

  it('shows loading state during execution', async () => {
    ;(api.executeDebug as jest.Mock).mockReturnValue(new Promise(() => {}))

    render(<ExecutionTimeline />)
    
    const button = screen.getByRole('button', { name: /execute with debug/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/executing/i)).toBeInTheDocument()
    })
  })
})
