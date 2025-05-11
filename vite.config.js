import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react()], // This enables React support
  resolve: {
    alias: {
      // Set up path aliases (optional but recommended)
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    // Development server options
    port: 3000,
    open: true
  },
  build: {
    // Production build options
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
});
