import { defineConfig, mergeConfig } from 'vitest/config';

// eslint-disable-next-line no-restricted-imports
import viteConfig from './vite.config.ts';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  } 
}));
