import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import license from 'rollup-plugin-license';
import path from 'path';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    sveltekit()
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
