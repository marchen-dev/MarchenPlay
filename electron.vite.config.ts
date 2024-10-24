import fs from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(join(__dirname, 'package.json'), 'utf-8'))

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@pkg': resolve('./package.json'),
        '@main': resolve('src/main'),
        '@renderer': resolve('src/renderer/src'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@main': resolve('src/main'),
        '@pkg': resolve('./package.json'),
      },
    },
    plugins: [react()],
    define: {
      APP_NAME: JSON.stringify(packageJson.name),
    },
    server: {
      host: '0.0.0.0',
    },
  },
})
