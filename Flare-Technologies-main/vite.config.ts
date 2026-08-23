import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'
import sitemap from 'vite-plugin-sitemap'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sitemapRoutes = [
  '/',
  '/about',
  '/services',
  '/results',
  '/contact',
  '/methodology',
  '/careers',
  '/main-services/automated-systems',
  '/main-services/engineering-development',
  '/main-services/growth-marketing',
  '/main-services/consulting-strategy',
  '/main-services/cloud-infrastructure',
  '/main-services/ai-solutions',
  '/main-services/b2b-partnerships',
]

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://www.flaretechnologies.in',
      dynamicRoutes: sitemapRoutes,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
