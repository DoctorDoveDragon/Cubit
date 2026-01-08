import type { Preview } from '@storybook/react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f3f4f6'
        },
        {
          name: 'dark',
          value: '#1f2937'
        }
      ]
    }
  }
}

export default preview
