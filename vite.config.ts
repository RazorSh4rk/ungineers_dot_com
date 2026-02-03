import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-pages-json',
      buildStart() {
        copyFileSync('pages.json', 'public/pages.json')
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
