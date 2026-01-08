import type { Meta, StoryObj } from '@storybook/react'
import ExecutionTimeline from './ExecutionTimeline'
import type { ExecutionStep } from '@/types/api'

const meta = {
  title: 'Execution/ExecutionTimeline',
  component: ExecutionTimeline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExecutionTimeline>

export default meta
type Story = StoryObj<typeof meta>

const sampleSteps: ExecutionStep[] = [
  {
    id: 'lexer-001',
    module: 'lexer',
    timestamp: new Date().toISOString(),
    duration_ms: 12.5,
    input: 'x = 5\ny = 10\nz = x + y\nprint(z)',
    output: {
      tokens: ['IDENTIFIER(x)', 'ASSIGN', 'NUMBER(5)', 'NEWLINE', 'IDENTIFIER(y)', 'ASSIGN', 'NUMBER(10)', 'NEWLINE', 'IDENTIFIER(z)', 'ASSIGN', 'IDENTIFIER(x)', 'PLUS', 'IDENTIFIER(y)', 'NEWLINE', 'IDENTIFIER(print)', 'LPAREN', 'IDENTIFIER(z)', 'RPAREN']
    },
    status: 'completed'
  },
  {
    id: 'parser-001',
    module: 'parser',
    timestamp: new Date().toISOString(),
    duration_ms: 18.3,
    input: 'tokens from lexer',
    output: {
      ast_summary: 'Program'
    },
    status: 'completed'
  },
  {
    id: 'interpreter-001',
    module: 'interpreter',
    timestamp: new Date().toISOString(),
    duration_ms: 45.7,
    input: 'AST from parser',
    output: {
      result: null,
      stdout: '15\n',
      variables: {
        x: 5,
        y: 10,
        z: 15
      }
    },
    status: 'completed'
  }
]

export const Empty: Story = {
  args: {
    steps: []
  },
}

export const WithSteps: Story = {
  args: {
    steps: sampleSteps
  },
}

export const WithError: Story = {
  args: {
    steps: [
      ...sampleSteps.slice(0, 2),
      {
        id: 'interpreter-error',
        module: 'interpreter',
        timestamp: new Date().toISOString(),
        duration_ms: 0,
        input: 'AST from parser',
        output: {},
        status: 'error',
        error: 'NameError: name \'undefined_var\' is not defined'
      }
    ]
  },
}
