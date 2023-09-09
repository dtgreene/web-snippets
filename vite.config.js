import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
  },
  base: './',
  root: resolve(__dirname, 'src/content/modal'),
  build: {
    outDir: resolve(__dirname, 'dist_modal'),
    // Required since output directory is outside of root
    emptyOutDir: true,
  },
});
