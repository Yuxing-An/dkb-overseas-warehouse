import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        andy: resolve(__dirname, 'andy.html'),
        daisy: resolve(__dirname, 'daisy.html'),
        anna: resolve(__dirname, 'anna.html')
      }
    }
  }
});
