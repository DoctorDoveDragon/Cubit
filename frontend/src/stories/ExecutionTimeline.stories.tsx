import type { Meta, StoryObj } from '@storybook/react'
import ExecutionTimeline from '../app/execution/components/ExecutionTimeline'

const meta = {
  title: 'Execution/ExecutionTimeline',
  component: ExecutionTimeline,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ExecutionTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCustomCode: Story = {
  render: () => <ExecutionTimeline />
}
