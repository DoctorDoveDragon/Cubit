import type { Meta, StoryObj } from '@storybook/react'
import SystemFlowchart from './SystemFlowchart'

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

// Mock the API module status data for Storybook
const mockModuleStatus = {
  modules: [
    {
      id: 'lexer',
      name: 'Lexer',
      type: 'core' as const,
      status: 'active' as const,
      version: '1.0.0',
      metrics: {
        total_requests: 150,
        successful_requests: 148,
        failed_requests: 2,
        avg_response_time_ms: 12.5,
        last_request_time: new Date().toISOString()
      }
    },
    {
      id: 'parser',
      name: 'Parser',
      type: 'core' as const,
      status: 'active' as const,
      version: '1.0.0',
      metrics: {
        total_requests: 148,
        successful_requests: 148,
        failed_requests: 0,
        avg_response_time_ms: 18.3,
      }
    },
    {
      id: 'interpreter',
      name: 'Interpreter',
      type: 'core' as const,
      status: 'active' as const,
      version: '1.0.0',
      metrics: {
        total_requests: 148,
        successful_requests: 145,
        failed_requests: 3,
        avg_response_time_ms: 45.7,
      }
    },
    {
      id: 'ped-api',
      name: 'Pedagogical API',
      type: 'pedagogical' as const,
      status: 'active' as const,
      version: '1.0.0',
      metrics: {
        total_requests: 80,
        successful_requests: 80,
        failed_requests: 0,
        avg_response_time_ms: 5.2,
      }
    },
  ],
  system: {
    total_modules: 11,
    active_modules: 11,
    error_modules: 0,
    uptime_seconds: 3600
  }
}

// Set up mock for the story
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.fetch = async (url: string) => {
    if (url.includes('/api/modules/status')) {
      return {
        ok: true,
        json: async () => mockModuleStatus
      }
    }
    return { ok: false, json: async () => ({}) }
  }
}

export const Default: Story = {
  args: {},
}

export const WithSelection: Story = {
  args: {
    onModuleSelect: (module) => console.log('Selected module:', module)
  },
}
