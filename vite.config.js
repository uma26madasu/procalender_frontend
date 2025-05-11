import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import terser from 'terser'; // Added for explicit minification

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@assets': resolve(__dirname, 'src/assets') // Added assets alias
    },
    extensions: ['.js', '.jsx', '.svg'] // Added .svg extension
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://procalender-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true
      }
    },
    port: 3000,
    open: false,
    host: true // Enable network access
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: { // Explicit terser configuration
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      },
      format: {
        comments: false
      }
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor_firebase';
            if (id.includes('react')) return 'vendor_react';
            if (id.includes('zod')) return 'vendor_validation';
            return 'vendor';
          }
        },
        assetFileNames: 'assets/[name].[hash].[ext]' // Better asset naming
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
      'zod'
    ],
    exclude: ['js-big-decimal']
  },
  define: {
    global: {},
    'process.env': process.env // Better environment variable handling
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  }
});