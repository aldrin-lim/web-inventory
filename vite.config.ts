/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
export const hash = Math.floor(Math.random() * 90000) + 1000000

// https://vitejs.dev/config/
export default mergeConfig(viteConfig, {
  plugins: [react(), tsconfigPaths()],
  test: {},
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].` + hash + `.js`,
        chunkFileNames: `[name].` + hash + `.js`,
        assetFileNames: `[name].` + hash + `.[ext]`,
      },
    },
  },
})
