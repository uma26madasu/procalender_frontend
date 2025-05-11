import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react({
    // Additional React plugin options
    jsxRuntime: 'automatic', // Recommended for React 17+
    babel: {
      plugins: [
        // Optional: Add any Babel plugins you need
        'babel-plugin-macros',
      ],
    },
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Add more aliases if needed
      '~assets': path.resolve(__dirname, './src/assets'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] // Add all extensions you use
  },
  server: {
    port: 3000,
    open: true,
    host: true, // Needed for Docker or network access
    strictPort: true, // Exit if port is in use
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true, // Recommended for production debugging
    chunkSizeWarningLimit: 1600, // Adjust based on your needs
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Simplified syntax
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Better chunking for dependencies
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle these dependencies
    exclude: ['your-large-library'] // Exclude problematic ones
  }
});
