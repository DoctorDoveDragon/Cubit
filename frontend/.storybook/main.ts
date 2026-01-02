import type { StorybookConfig } from '@storybook/react/types';
const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react'
};
export default config;
