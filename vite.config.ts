import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit(),
  ],
  define: {
    __APP_NAME__: JSON.stringify(pkg.name),
    __APP_VERSION__: JSON.stringify(pkg.version)
  }
});
