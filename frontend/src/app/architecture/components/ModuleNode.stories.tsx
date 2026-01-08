import type { Meta, StoryObj } from '@storybook/react'
import ModuleNode from './ModuleNode'
import type { Module } from '@/types/api'

const meta = {
  title: 'Architecture/ModuleNode',
  component: ModuleNode,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ModuleNode>

export default meta
type Story = StoryObj<typeof meta>

const sampleModule: Module = {
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
    last_request_time: new Date().toISOString()
  }
}

export const CoreModule: Story = {
  args: {
    data: { module: sampleModule },
  },
}

export const PedagogicalModule: Story = {
  args: {
    data: {
      module: {
        ...sampleModule,
        id: 'ped-api',
        name: 'Pedagogical API',
        type: 'pedagogical',
      }
    },
  },
}

export const GameModule: Story = {
  args: {
    data: {
      module: {
        ...sampleModule,
        id: 'games-executor',
        name: 'Games Executor',
        type: 'game',
      }
    },
  },
}

export const ErrorModule: Story = {
  args: {
    data: {
      module: {
        ...sampleModule,
        status: 'error',
        metrics: {
          ...sampleModule.metrics,
          failed_requests: 50,
          successful_requests: 100,
        }
      }
    },
  },
}
