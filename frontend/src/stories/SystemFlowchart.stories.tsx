import type { Meta, StoryObj } from '@storybook/react'
import SystemFlowchart from '../app/architecture/components/SystemFlowchart'

const meta = {
  title: 'Architecture/SystemFlowchart',
  component: SystemFlowchart,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SystemFlowchart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onModuleClick: (module) => console.log('Module clicked:', module)
  }
}

export const WithoutCallback: Story = {
  args: {}
}
