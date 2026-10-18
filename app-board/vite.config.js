import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: true,
    // 서버에 CORS 설정이 없으므로 개발 중에는 프록시를 사용한다
    proxy: {
      '/api': { target: 'http://222.239.249.197:8080', changeOrigin: true },
    },
  },
})
