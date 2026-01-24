import { build, files, version } from '$service-worker';

// キャッシュ名の定義
const CACHE = `cache-${version}`;

// プリキャッシュするファイル
const ASSETS = [
  ...build, // アプリケーションファイル
  ...files // 静的ファイル
];

// Service Worker のインストール
self.addEventListener('install', (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
  // ナビゲーションリクエストの処理
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // ネットワークから取得を試行
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // オフライン時はキャッシュから取得
          const cache = await caches.open(CACHE);
          const cachedResponse = await cache.match('/');
          return cachedResponse;
        }
      })()
    );
  }
});
