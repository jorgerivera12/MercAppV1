import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    // Redirige /api y /uploads al backend Express en desarrollo para evitar errores CORS
    proxy: {
      '/api':     'http://localhost:3000',
      '/uploads': 'http://localhost:3000'
    }
  }
})
