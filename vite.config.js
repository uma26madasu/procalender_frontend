import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  plugins: [react({
    // Remove emotion config unless you're using it
    babel: {
      plugins: [] // Remove emotion plugin if not needed
    }
  })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages')
    },
    extensions: ['.js', '.jsx']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://procalender-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true // Set to true for production
      }
    },
    port: 3000,
    open: false // Disable auto-open in production
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    minify: 'terser',
    chunkSizeWarningLimit: 1000, // More conservative limit
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor_firebase';
            if (id.includes('react')) return 'vendor_react';
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: []
  }
});