import type { Meta, StoryObj } from '@storybook/react'
import SystemFlowchart from './SystemFlowchart'
import type { ModuleStatusResponse } from '@/types/api'

const meta = {
  title: 'Architecture/SystemFlowchart',
  component: SystemFlowchart,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SystemFlowchart>

export default meta
type Story = StoryObj<typeof meta>

// Mock module status data for stories
const mockModuleData: ModuleStatusResponse = {
  modules: [
    {
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
    },
    {
      id: 'parser',
      name: 'Parser',
      type: 'core',
      status: 'active',
      version: '1.0.0',
      metrics: {
        total_requests: 148,
        successful_requests: 143,
        failed_requests: 5,
        average_duration_ms: 18.3,
        last_request_time: new Date().toISOString(),
      },
    },
    {
      id: 'interpreter',
      name: 'Interpreter',
      type: 'core',
      status: 'active',
      version: '1.0.0',
      metrics: {
        total_requests: 146,
        successful_requests: 141,
        failed_requests: 5,
        average_duration_ms: 45.7,
        last_request_time: new Date().toISOString(),
      },
    },
    {
      id: 'ped-api',
      name: 'Pedagogical API',
      type: 'pedagogical',
      status: 'active',
      version: '1.0.0',
      metrics: {
        total_requests: 89,
        successful_requests: 88,
        failed_requests: 1,
        average_duration_ms: 25.3,
        last_request_time: new Date().toISOString(),
      },
    },
    {
      id: 'fastapi',
      name: 'FastAPI Server',
      type: 'api',
      status: 'active',
      version: '1.0.0',
      metrics: {
        total_requests: 520,
        successful_requests: 518,
        failed_requests: 2,
        average_duration_ms: 5.2,
        last_request_time: new Date().toISOString(),
      },
    },
  ],
  system: {
    total_modules: 5,
    active_modules: 5,
    error_modules: 0,
    uptime_seconds: 3600,
  },
}

export const Default: Story = {
  args: {
    onModuleSelect: (module) => console.log('Selected module:', module),
  },
  parameters: {
    mockData: [
      {
        url: '/api/modules/status',
        method: 'GET',
        status: 200,
        response: mockModuleData,
      },
    ],
  },
}

export const WithSelection: Story = {
  args: {
    onModuleSelect: (module) => alert(`Selected: ${module.name}`),
  },
  parameters: {
    mockData: [
      {
        url: '/api/modules/status',
        method: 'GET',
        status: 200,
        response: mockModuleData,
      },
    ],
  },
}
