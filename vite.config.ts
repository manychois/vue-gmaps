import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      name: 'VueGmaps',
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'vue-gmaps',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        dir: resolve(__dirname, 'dist'),
      },
    },
  },
});
