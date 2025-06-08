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
    svelte({compilerOptions: {
      dev: true,
      css: 'external'
    }}),
    // viteSingleFile({ useRecommendedBuildConfig: false })
  ],
  resolve: {
    'alias': {
      '_shared': `${__shared}/src`,
      "@src": resolve(__dirname, 'src', 'svelte')
    }
  },
  server: {
    open: false,
    strictPort: true,
    hmr: false

  },
  cacheDir: '../.vite-cache',
  build: {
    target: 'modules',
    outDir: '../dist/static',
    assetsDir: 'public',
    copyPublicDir:false,
    minify: false,
    cssMinify: false,
    emptyOutDir: false,
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    write: true
  }
})
