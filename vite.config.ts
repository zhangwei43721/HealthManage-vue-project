import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite' // Import the vite plugin
// import autoprefixer from 'autoprefixer' // Autoprefixer is likely included by the vite plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(), // Use the vite plugin
  ],
  // Remove manual postcss config, the vite plugin handles it
  // css: {
  //   postcss: {
  //     plugins: [
  //       tailwindcss(),
  //       autoprefixer,
  //     ],
  //   },
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
