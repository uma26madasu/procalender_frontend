import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import terser from 'terser'; // Explicit terser import

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@assets': resolve(__dirname, 'src/assets')
    },
    extensions: ['.js', '.jsx', '.svg']
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
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // Remove console.logs in production
        drop_debugger: true,   // Remove debugger statements
        pure_funcs: ['console.info', 'console.debug'], // Remove specific console methods
        passes: 2             // More compression passes (default is 1)
      },
      format: {
        comments: false,      // Remove all comments
        beautify: false       // Don't beautify output
      },
      mangle: {
        properties: {
          regex: /^_/         // Mangle properties starting with underscore
        }
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
        assetFileNames: 'assets/[name].[hash].[ext]'
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
    'process.env': {}
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  }
});