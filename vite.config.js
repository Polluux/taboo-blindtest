import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
  // base: path.resolve(__dirname, './dist'),
  base: process.env.NODE_ENV === 'production'
    ? '/taboo-blindtest/'
    : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [vue()],
  server: {
    port: 3000
  }
});
