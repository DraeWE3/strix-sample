import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { prerenderPlugin } from './build/prerenderPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prerenderPlugin()],
})
