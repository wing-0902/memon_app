import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
/* import license from 'rollup-plugin-license';
import path from 'path'; */
import pkg from './package.json' with { type: 'json' };
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit(),
    SvelteKitPWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      injectRegister: false,
      srcDir: 'src',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'web-app-manifest-192x192.png',
        'web-app-manifest-512x512.png'
      ],
      buildBase: '/',
      scope: '/',
      workbox: {
        navigateFallback: '/',
        navigateFallbackAllowlist: [/^\/.*$/],
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,webmanifest}'],
        skipWaiting: true,
        clientsClaim: true
      },
      manifest: {
        name: 'Memon - 単語帳',
        short_name: 'Memon',
        description:
          'Memon is the best way to memorize something such as English words. Memory On your Memo.',
        theme_color: '#06172f',
        background_color: '#06172f',
        display: 'standalone',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  define: {
    __APP_NAME__: JSON.stringify(pkg.name),
    __APP_VERSION__: JSON.stringify(pkg.version)
  }
});
