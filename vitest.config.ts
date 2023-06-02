import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
    ],
    testTimeout: 20000,
    // node14 segfaults often with threads
    threads: !process.versions.node.startsWith('14'),
  },
  esbuild: {
    target: 'node16',
  },
});
