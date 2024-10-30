import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- Special case for alias configuration
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  plugins: [react()],
});
