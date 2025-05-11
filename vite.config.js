import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Verify file exists
const entryPath = path.resolve(__dirname, 'src/main.jsx');
if (!fs.existsSync(entryPath)) {
  throw new Error(`Entry file not found at ${entryPath}`);
}

export default defineConfig({
  root: path.resolve(__dirname, '.'), // Absolute path
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, './') // Root alias
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
