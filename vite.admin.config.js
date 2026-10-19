import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// The page lives in ./admin-app but imports from ../src; the dev server only serves
// files under its root, so send /src/* requests through Vite's /@fs/ route.
const srcFromProjectRoot = () => ({
  name: 'admin-dev-src',
  configureServer(server) {
    const src = fileURLToPath(new URL('./src', import.meta.url))
    server.middlewares.use((req, _res, next) => {
      if (req.url?.startsWith('/src/')) req.url = `/@fs${src}${req.url.slice(4)}`
      next()
    })
  },
})

// Standalone build of the content studio, served from admin.strixproduction.com
export default defineConfig({
  root: fileURLToPath(new URL('./admin-app', import.meta.url)),
  envDir: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), srcFromProjectRoot()],
  server: { port: 5174, fs: { allow: ['..'] } },
  preview: { port: 4174 },
  build: {
    outDir: fileURLToPath(new URL('./dist-admin', import.meta.url)),
    emptyOutDir: true,
  },
})
