
/* eslint-env node */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    base: '/visbook_strapi/',
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: true,
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1000
    },
    preview: {
      allowedHosts: ['visbook.onrender.com']
    }
  };
});