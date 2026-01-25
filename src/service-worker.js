import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

// --- 1. インストール時は新しいキャッシュを作るだけ ---
self.addEventListener('install', (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }
  event.waitUntil(addFilesToCache());
  // 新しいSWにすぐに切り替えたい場合は self.skipWaiting() を呼ぶのもアリです
});

// --- 2. 古いキャッシュの削除は「activate」で行う ---
self.addEventListener('activate', (event) => {
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }
  event.waitUntil(deleteOldCaches());
});

// --- 3. フェッチ処理 ---
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // まずはネットワーク経由
          const networkResponse = await fetch(event.request);

          // 308リダイレクト等の「汚染されたレスポンス」をキャッシュさせないための防御策
          if (networkResponse.ok) {
            // 必要ならここでキャッシュを更新するロジックを入れますが、
            // 今はループ脱出を優先してそのまま返します
          }

          return networkResponse;
        } catch (error) {
          // オフライン、またはネットワークエラー（ループ含む）時にここへ
          const cache = await caches.open(CACHE);

          // ループの元凶だった '/' ではなく、物理ファイルである 'fallback.html' を指定
          const cachedResponse = await cache.match('/fallback.html');

          // status < 300 (200 OKなど) の時だけ返す
          if (cachedResponse && cachedResponse.status < 300) {
            return cachedResponse;
          }

          return Response.error();
        }
      })()
    );
  }
});
