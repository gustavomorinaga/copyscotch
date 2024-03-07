import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: [
			...(isDev ? ['svelte-codemirror-editor'] : []),
			'codemirror',
			'@codemirror/lang-html',
			'@codemirror/lang-json'
		]
	}
});
