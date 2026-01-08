import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ExecutionTimeline from '@/app/execution/components/ExecutionTimeline'
import type { ExecutionStep } from '@/types/api'

describe('ExecutionTimeline', () => {
  it('renders empty state when no steps provided', () => {
    render(<ExecutionTimeline steps={[]} />)
    expect(screen.getByText(/execute code to see the step-by-step timeline/i)).toBeInTheDocument()
  })

  it('renders steps when provided', () => {
    const steps: ExecutionStep[] = [
      {
        id: 'lexer-001',
        module: 'lexer',
        timestamp: new Date().toISOString(),
        duration_ms: 12.5,
        input: 'x = 5',
        output: { tokens: [] },
        status: 'completed'
      },
      {
        id: 'parser-001',
        module: 'parser',
        timestamp: new Date().toISOString(),
        duration_ms: 18.3,
        input: 'tokens',
        output: {},
        status: 'completed'
      },
    ]

    render(<ExecutionTimeline steps={steps} />)
    expect(screen.getByText(/lexer/i)).toBeInTheDocument()
    expect(screen.getByText(/parser/i)).toBeInTheDocument()
  })

  it('displays error state for failed steps', () => {
    const steps: ExecutionStep[] = [
      {
        id: 'lexer-error',
        module: 'lexer',
        timestamp: new Date().toISOString(),
        duration_ms: 0,
        input: 'invalid code',
        output: {},
        status: 'error',
        error: 'Syntax error'
      },
    ]

    render(<ExecutionTimeline steps={steps} />)
    expect(screen.getByText(/syntax error/i)).toBeInTheDocument()
  })
})
