import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
  ],
  preview: {
    port: 6000,
    strictPort: true,
  },
  server: {
    port: 6000,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:6000",
  }
})
