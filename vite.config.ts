import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import license from 'rollup-plugin-license';
import path from 'path';
import pkg from './package.json' with { type: 'json' };
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Memon - 単語帳',
        short_name: 'Memon',
        description: 'Memon is the best way to memorize something such as English words. Memory On your Memo.',
        theme_color: 'rgb(6,23,47)',
        background_color: 'rgb(6,23,47)',
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
    /*// 1回目：テキストファイルの出力用
    license({
      thirdParty: {
        output: {
          file: path.resolve(__dirname, './static/OSS-LICENSES.txt'),
          encoding: 'utf-8'
        },
        includePrivate: false
      }
    }),
    // 2回目：JSONデータの出力用
    license({
      thirdParty: {
        output: {
          file: path.join(__dirname, 'src/lib/data/oss-licenses.json'),
          template(dependencies) {
            return JSON.stringify(dependencies, null, 2);
          }
        },
        includePrivate: true
      }
    })*/
  ],
  define: {
    __APP_NAME__: JSON.stringify(pkg.name),
    __APP_VERSION__: JSON.stringify(pkg.version)
  }
});
