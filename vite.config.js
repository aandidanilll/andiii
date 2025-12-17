import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Ganti dengan URL backend Anda
        changeOrigin: true, // Mengubah origin untuk menghindari masalah CORS
        secure: false, // Set ke false jika backend menggunakan HTTP, bukan HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''), // Jika perlu, sesuaikan path
      },
    },
  },
})
