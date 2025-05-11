import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: '/', // Changed from './' to '/' for proper path resolution
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Add alias for easier imports
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://procalender-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});