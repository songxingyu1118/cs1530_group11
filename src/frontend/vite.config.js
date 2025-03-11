import { defineConfig } from 'vite';
import path from "path";
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Added backend address
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:8080', // Uploads directory for images
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
