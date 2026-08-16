import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo at /olympics/ when GITHUB_PAGES=true.
const base = process.env.GITHUB_PAGES === 'true' ? '/olympics/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Allow Cloudflare quick tunnels / Cursor previews while developing.
    allowedHosts: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
