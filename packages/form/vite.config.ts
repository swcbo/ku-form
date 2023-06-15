import { defineConfig } from 'vite';
import packageJSON from './package.json';
import path from 'path';
const OutPutConfig = {
  globals: {
    react: 'react',
  },
};
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    sourcemap: false,
    outDir: 'lib',
    lib: {
      entry: 'src/index.ts',
      name: packageJSON.name,
      fileName: 'index',
      formats: ['es', 'umd', 'cjs'],
    },

    rollupOptions: {
      output: {
        exports: 'named',
        globals: OutPutConfig.globals,
      },
      external: ['react'],
    },
  },
});
