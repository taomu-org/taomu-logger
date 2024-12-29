import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },

  plugins: [react()],

  build: {
    lib: {
      entry: ['./lib/index.ts'],
      // name: 'logger',
      // fileName: 'logger',
    },
  },
})
