import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// Standalone build of the content studio, served from admin.strixproduction.com
export default defineConfig({
  root: fileURLToPath(new URL('./admin-app', import.meta.url)),
  envDir: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  server: { port: 5174, fs: { allow: ['..'] } },
  preview: { port: 4174 },
  build: {
    outDir: fileURLToPath(new URL('./dist-admin', import.meta.url)),
    emptyOutDir: true,
  },
})
