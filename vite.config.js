import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Handle missing entry file gracefully
const getEntryPath = () => {
  const possibleEntries = [
    'src/main.jsx',
    'src/main.js',
    'src/index.jsx',
    'src/index.js'
  ]

  for (const entry of possibleEntries) {
    const fullPath = path.resolve(__dirname, entry)
    if (fs.existsSync(fullPath)) {
      return fullPath
    }
  }
  
  // Create default entry if none exists
  const fallbackPath = path.resolve(__dirname, 'src/main.jsx')
  fs.mkdirSync(path.dirname(fallbackPath), { recursive: true })
  fs.writeFileSync(fallbackPath, `
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    export default function App() { return <h1>Welcome</h1> }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />)
  `)
  return fallbackPath
}

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        app: getEntryPath()
      }
    }
  }
})
