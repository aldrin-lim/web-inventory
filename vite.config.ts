/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'

export const hash = Math.floor(Math.random() * 90000) + 1000000

// https://vitejs.dev/config/
export default mergeConfig(viteConfig, {
  plugins: [
    react(),
    tsconfigPaths(),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'qrafter',
      project: 'web-inventory',
    }),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      devOptions: {
        enabled: process.env.NODE_ENV === 'development',
      },
      includeAssets: ['**/*'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        sourcemap: true,
      },
      manifest: {
        name: 'Qrafter Admin',
        short_name: 'Qrafter Admin',
        theme_color: '#00B1BC',
        start_url: '/',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple touch icon',
          },
          {
            src: '/maskable_icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {},
  define: process.env.NODE_ENV === 'development' ? { global: 'window' } : {},
  build: {
    sourcemap: true,
  },
})
