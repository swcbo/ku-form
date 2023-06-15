import { defineConfig } from 'vite';
import packageJSON from './package.json';
const OutPutConfig = {
  globals: {
    react: 'react',
    'react/jsx-runtime': 'jsxRuntime',
  },
};
export default defineConfig({
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
      external: ['react', 'react/jsx-runtime'],
    },
  },
});
