import { defineConfig } from 'vite';
import packageJSON from './package.json';
export default defineConfig({
	build: {
		sourcemap: false,
		lib: {
			entry: 'src/index.ts',
			name: packageJSON.name,
			fileName: 'index',
		},
		rollupOptions: {
			output: [
				{
					exports: 'named',
					format: 'es',
					dir: 'lib/esm',
				},
				{
					exports: 'named',
					format: 'umd',
					name: packageJSON.name,
					dir: 'lib/umd',
				},
				{
					exports: 'named',
					format: 'cjs',
					dir: 'lib/cjs',
				},
			],
		},
	},
});
