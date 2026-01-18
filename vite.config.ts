import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import license from 'rollup-plugin-license';
import path from 'path';

export default defineConfig({
  plugins: [
	sveltekit(),
	license({
		thirdParty: {
			output: path.resolve(__dirname, './static/oss-LICENSE.txt'),
			includePrivate: false
		}
	})
]
});
