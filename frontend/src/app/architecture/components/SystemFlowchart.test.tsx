import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SystemFlowchart from '@/app/architecture/components/SystemFlowchart'

describe('SystemFlowchart', () => {
  it('renders loading state initially', () => {
    render(<SystemFlowchart />)
    expect(screen.getByText(/loading system architecture/i)).toBeInTheDocument()
  })

  it('renders flowchart after loading', async () => {
    render(<SystemFlowchart />)
    // Wait for the component to fetch data and render
    await screen.findByText(/lexer/i, {}, { timeout: 3000 })
  })
})
