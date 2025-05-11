import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  plugins: [react({
    jsxImportSource: '@emotion/react', // Optional: if using CSS-in-JS
    babel: {
      plugins: ['@emotion/babel-plugin'] // Optional: for better Emotion support
    }
  })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Add these common aliases if needed
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages')
    },
    extensions: ['.js', '.jsx', '.json'] // Add other extensions if needed
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://procalender-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false // Only if you're having SSL issues
      }
    },
    port: 3000, // Explicit port
    open: true // Auto-open browser
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser', // Better minification
    chunkSizeWarningLimit: 1600, // Adjust chunk size warning
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-router-dom'
      ],
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase'],
          form: ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'firebase'
    ],
    exclude: ['js-big-decimal'] // Exclude problematic packages if any
  },
  esbuild: {
    jsxInject: `import React from 'react'` // Ensure React is available
  }
});