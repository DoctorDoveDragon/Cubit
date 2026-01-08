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
    successful_requests: 145,
    failed_requests: 5,
    average_duration_ms: 12.5,
    last_request_time: new Date().toISOString(),
  },
}

export const CoreModuleActive: Story = {
  args: {
    data: {
      module: sampleModule,
      onClick: (module) => console.log('Clicked module:', module),
    },
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
        metrics: {
          total_requests: 89,
          successful_requests: 88,
          failed_requests: 1,
          average_duration_ms: 25.3,
          last_request_time: new Date().toISOString(),
        },
      },
      onClick: (module) => console.log('Clicked module:', module),
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
        metrics: {
          total_requests: 42,
          successful_requests: 40,
          failed_requests: 2,
          average_duration_ms: 18.7,
          last_request_time: new Date().toISOString(),
        },
      },
      onClick: (module) => console.log('Clicked module:', module),
    },
  },
}

export const ApiModule: Story = {
  args: {
    data: {
      module: {
        ...sampleModule,
        id: 'fastapi',
        name: 'FastAPI Server',
        type: 'api',
        metrics: {
          total_requests: 520,
          successful_requests: 518,
          failed_requests: 2,
          average_duration_ms: 5.2,
          last_request_time: new Date().toISOString(),
        },
      },
      onClick: (module) => console.log('Clicked module:', module),
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
          total_requests: 10,
          successful_requests: 2,
          failed_requests: 8,
          average_duration_ms: 0,
          last_request_time: new Date().toISOString(),
        },
      },
      onClick: (module) => console.log('Clicked module:', module),
    },
  },
}

export const NoMetrics: Story = {
  args: {
    data: {
      module: {
        ...sampleModule,
        metrics: {
          total_requests: 0,
          successful_requests: 0,
          failed_requests: 0,
          average_duration_ms: 0,
          last_request_time: null,
        },
      },
      onClick: (module) => console.log('Clicked module:', module),
    },
  },
}
