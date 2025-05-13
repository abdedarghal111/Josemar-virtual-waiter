import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile  } from 'vite-plugin-singlefile';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const __shared = resolve(__dirname, '..', 'shared')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), 
    svelte(),
    viteSingleFile()
  ],
  resolve: {
    'alias': {
      '_shared': `${__shared}/src`
    }
  },
  build: {
    target: 'modules',
    outDir: '../dist/static',
    assetsDir: 'public',
    cssMinify: true,
    minify: true,
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 0
  }
})
