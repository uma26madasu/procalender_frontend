import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  base: process.env.VERCEL_ENV === 'production' ? '/' : '/', // Vercel-specific base URL
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
    minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug']
      },
      format: {
        comments: false
      }
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['react-firebase-hooks/auth'], // Add this line to fix the build error
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
      'zod',
      'react-firebase-hooks' // Add this line to include the dependency for optimization
    ],
    exclude: ['js-big-decimal']
  },
  define: {
    'process.env': process.env // Pass through environment variables
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