import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // This allows external access
    port: 5173
  }
})