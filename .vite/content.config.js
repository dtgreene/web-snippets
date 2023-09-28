import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  root: resolve(__dirname, '../src'),
  build: {
    outDir: resolve(__dirname, '../vite_dist'),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: 'src/content/index.js',
      },
      output: {
        generatedCode: 'es2015',
        entryFileNames: ({ name }) => {
          if (name === 'content') {
            return 'content/index.js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
});
