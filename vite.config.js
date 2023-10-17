import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,eot,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 3000000,
      },
      manifest: {
        name: 'School-Tools',
        description: 'Verschiedene Tools rund um die Schulverwaltung',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icon512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ],
  base: "./"
})
