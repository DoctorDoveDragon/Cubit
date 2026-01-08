import type { Meta, StoryObj } from '@storybook/react'
import ModuleNode from '../app/architecture/components/ModuleNode'
import { ReactFlow, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { Module } from '../types/api'

const meta = {
  title: 'Architecture/ModuleNode',
  component: ModuleNode,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ModuleNode>

export default meta
type Story = StoryObj<typeof meta>

const mockModule: Module = {
  id: 'lexer',
  name: 'Lexer',
  type: 'core',
  status: 'active',
  version: '1.0.0',
  metrics: {
    total_requests: 150,
    successful_requests: 148,
    failed_requests: 2,
    average_response_time_ms: 12.5,
    last_request_time: new Date().toISOString()
  }
}

export const ActiveCore: Story = {
  args: {
    data: {
      module: mockModule,
      onClick: (module) => console.log('Clicked:', module)
    }
  },
  render: (args) => (
    <div style={{ width: '300px', height: '200px' }}>
      <ReactFlow
        nodes={[
          {
            id: '1',
            type: 'moduleNode',
            position: { x: 50, y: 50 },
            data: args.data
          }
        ]}
        nodeTypes={{ moduleNode: ModuleNode }}
      >
        <Background />
      </ReactFlow>
    </div>
  )
}

export const PedagogicalModule: Story = {
  args: {
    data: {
      module: {
        ...mockModule,
        id: 'ped-api',
        name: 'Pedagogical API',
        type: 'pedagogical',
        metrics: {
          total_requests: 87,
          successful_requests: 87,
          failed_requests: 0,
          average_response_time_ms: 8.2,
          last_request_time: new Date().toISOString()
        }
      }
    }
  },
  render: (args) => (
    <div style={{ width: '300px', height: '200px' }}>
      <ReactFlow
        nodes={[
          {
            id: '1',
            type: 'moduleNode',
            position: { x: 50, y: 50 },
            data: args.data
          }
        ]}
        nodeTypes={{ moduleNode: ModuleNode }}
      >
        <Background />
      </ReactFlow>
    </div>
  )
}

export const ErrorState: Story = {
  args: {
    data: {
      module: {
        ...mockModule,
        status: 'error',
        metrics: {
          total_requests: 20,
          successful_requests: 10,
          failed_requests: 10,
          average_response_time_ms: 45.3,
          last_request_time: new Date().toISOString()
        }
      }
    }
  },
  render: (args) => (
    <div style={{ width: '300px', height: '200px' }}>
      <ReactFlow
        nodes={[
          {
            id: '1',
            type: 'moduleNode',
            position: { x: 50, y: 50 },
            data: args.data
          }
        ]}
        nodeTypes={{ moduleNode: ModuleNode }}
      >
        <Background />
      </ReactFlow>
    </div>
  )
}
