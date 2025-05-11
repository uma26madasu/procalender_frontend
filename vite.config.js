import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mainEntry = path.resolve(__dirname, 'src/main.jsx')

// Verify file exists
if (!fs.existsSync(mainEntry)) {
  throw new Error(`CRITICAL: Entry file missing at ${mainEntry}`)
}

export default defineConfig({
  root: __dirname,
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'src': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        app: mainEntry // Explicit entry point
      },
      preserveEntrySignatures: 'strict'
    }
  }
})
