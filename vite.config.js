import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', '9wood-logo.webp'],
      manifest: {
        name: 'TWI Cards',
        short_name: 'TWI',
        description: 'Training Within Industry job cards for 9Wood supervisors.',
        theme_color: '#fe5000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Cache the app shell; data always comes fresh from Supabase over the network.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp}']
      }
    })
  ],
  server: {
    host: true
  }
})
