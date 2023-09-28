import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const tailwindConfig = {
  content: ['./src/popup/**/*.{html,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
  },
  base: './',
  root: resolve(__dirname, '../src/popup'),
  build: {
    outDir: resolve(__dirname, '../vite_dist'),
    emptyOutDir: false,
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss(tailwindConfig)],
    },
  },
});
