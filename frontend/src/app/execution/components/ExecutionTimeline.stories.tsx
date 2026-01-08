import type { Meta, StoryObj } from '@storybook/react'
import ExecutionTimeline from './ExecutionTimeline'
import type { DebugExecutionResponse } from '@/types/api'

const meta = {
  title: 'Execution/ExecutionTimeline',
  component: ExecutionTimeline,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExecutionTimeline>

export default meta
type Story = StoryObj<typeof meta>

const successfulExecution: DebugExecutionResponse = {
  steps: [
    {
      id: 'lexer-001',
      module: 'lexer',
      timestamp: new Date().toISOString(),
      duration_ms: 12.5,
      input: 'x = 10\ny = 20\nresult = x + y\nprint(result)',
      output: {
        tokens: ['IDENTIFIER(x)', 'EQUALS', 'NUMBER(10)', 'NEWLINE', 'IDENTIFIER(y)', 'EQUALS', 'NUMBER(20)', 'NEWLINE', 'IDENTIFIER(result)', 'EQUALS', 'IDENTIFIER(x)', 'PLUS', 'IDENTIFIER(y)', 'NEWLINE', 'IDENTIFIER(print)', 'LPAREN', 'IDENTIFIER(result)', 'RPAREN'],
      },
      status: 'completed',
    },
    {
      id: 'parser-001',
      module: 'parser',
      timestamp: new Date(Date.now() + 15).toISOString(),
      duration_ms: 18.3,
      input: 'tokens from lexer',
      output: {
        ast_summary: 'ProgramNode',
      },
      status: 'completed',
    },
    {
      id: 'interpreter-001',
      module: 'interpreter',
      timestamp: new Date(Date.now() + 35).toISOString(),
      duration_ms: 45.7,
      input: 'AST from parser',
      output: {
        result: 30,
        stdout: '30\n',
        variables: {
          x: 10,
          y: 20,
          result: 30,
        },
      },
      status: 'completed',
    },
  ],
  final_result: {
    output: '30\n',
    result: 30,
    error: null,
    skill_level: 'beginner',
    progress: {
      total_calls: 5,
      method_diversity: ['variables', 'arithmetic', 'print'],
    },
    suggestions: ['Try using loops', 'Learn about functions', 'Explore conditionals'],
  },
  total_duration_ms: 76.5,
}

const executionWithError: DebugExecutionResponse = {
  steps: [
    {
      id: 'lexer-001',
      module: 'lexer',
      timestamp: new Date().toISOString(),
      duration_ms: 11.2,
      input: 'x = 10\ny = x + z',
      output: {
        tokens: ['IDENTIFIER(x)', 'EQUALS', 'NUMBER(10)', 'NEWLINE', 'IDENTIFIER(y)', 'EQUALS', 'IDENTIFIER(x)', 'PLUS', 'IDENTIFIER(z)'],
      },
      status: 'completed',
    },
    {
      id: 'parser-001',
      module: 'parser',
      timestamp: new Date(Date.now() + 12).toISOString(),
      duration_ms: 15.8,
      input: 'tokens from lexer',
      output: {
        ast_summary: 'ProgramNode',
      },
      status: 'completed',
    },
    {
      id: 'interpreter-error',
      module: 'interpreter',
      timestamp: new Date(Date.now() + 30).toISOString(),
      duration_ms: 0,
      input: 'AST from parser',
      output: {},
      status: 'error',
      error: 'NameError: Variable \'z\' is not defined',
    },
  ],
  final_result: {
    output: null,
    result: null,
    error: 'NameError: Variable \'z\' is not defined',
    skill_level: 'beginner',
    progress: {},
    suggestions: [],
  },
  total_duration_ms: 27.0,
}

const simpleExecution: DebugExecutionResponse = {
  steps: [
    {
      id: 'lexer-001',
      module: 'lexer',
      timestamp: new Date().toISOString(),
      duration_ms: 8.2,
      input: 'print("Hello World")',
      output: {
        tokens: ['IDENTIFIER(print)', 'LPAREN', 'STRING(Hello World)', 'RPAREN'],
      },
      status: 'completed',
    },
    {
      id: 'parser-001',
      module: 'parser',
      timestamp: new Date(Date.now() + 10).toISOString(),
      duration_ms: 12.5,
      input: 'tokens from lexer',
      output: {
        ast_summary: 'ProgramNode',
      },
      status: 'completed',
    },
    {
      id: 'interpreter-001',
      module: 'interpreter',
      timestamp: new Date(Date.now() + 25).toISOString(),
      duration_ms: 15.1,
      input: 'AST from parser',
      output: {
        result: null,
        stdout: 'Hello World\n',
        variables: {},
      },
      status: 'completed',
    },
  ],
  final_result: {
    output: 'Hello World\n',
    result: null,
    error: null,
    skill_level: 'beginner',
    progress: {},
    suggestions: ['Try using variables', 'Learn about arithmetic operations'],
  },
  total_duration_ms: 35.8,
}

export const SuccessfulExecution: Story = {
  args: {
    debugData: successfulExecution,
  },
}

export const ExecutionWithError: Story = {
  args: {
    debugData: executionWithError,
  },
}

export const SimpleExecution: Story = {
  args: {
    debugData: simpleExecution,
  },
}
