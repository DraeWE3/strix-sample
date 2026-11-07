import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { prerenderPlugin } from './build/prerenderPlugin.js'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prerenderPlugin()],
});
