import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { copyFileSync, readdirSync, mkdirSync, existsSync, writeFileSync, cpSync } from 'fs'

function copyAssets() {
  // Copy pages.json
  copyFileSync('pages.json', 'public/pages.json')

  // Copy gallery folder and create manifest
  const galleryDir = 'about_us_gallery'
  const publicGalleryDir = 'public/gallery'

  if (existsSync(galleryDir)) {
    // Create public gallery dir if needed
    if (!existsSync(publicGalleryDir)) {
      mkdirSync(publicGalleryDir, { recursive: true })
    }

    // Get all image files
    const files = readdirSync(galleryDir).filter(f =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    )

    // Copy files with normalized names
    const manifest: string[] = []
    files.forEach((file, index) => {
      const ext = path.extname(file).toLowerCase()
      const newName = `${index}${ext}`
      cpSync(path.join(galleryDir, file), path.join(publicGalleryDir, newName))
      manifest.push(newName)
    })

    // Write manifest
    writeFileSync(
      path.join('public', 'gallery-manifest.json'),
      JSON.stringify(manifest)
    )
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-assets',
      buildStart() {
        copyAssets()
      },
      configureServer() {
        copyAssets()
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
