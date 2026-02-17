// `/bypass-service-worker/`ディレクトリはキャッシュ無効

// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { build, files, version } from '$service-worker';

// This gives `self` the correct types
const self = (globalThis as any).self as ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const filterCondition = (path: string) => !path.startsWith('/bypass-service-worker/');

const ASSETS = [
  ...build.filter(filterCondition), // App自身
  ...files.filter(filterCondition) // `static`の中
];

// スタンドアロン判定関数
const isStandalone = () => {
  return (
    self.matchMedia('(display-mode: standalone)').matches ||
    (self.navigator as any).standalone === true
  );
};

self.addEventListener('install', (event) => {
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    // 【変更点】スタンドアロンモードの時だけ ASSETS を一括キャッシュする
    if (isStandalone()) {
      console.log('Standalone mode detected: Pre-caching all assets.');
      const cache = await caches.open(CACHE);
      await cache.addAll(ASSETS);
    } else {
      console.log('Browser mode: Skipping pre-cache.');
    }
  }

  event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
  // ignore POST requests etc
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass service worker for local model files and specific domains
  if (
    url.pathname.startsWith('/bypass-service-worker/') ||
    url.hostname === 'api.ipify.org' ||
    url.hostname === 'api64.ipify.org'
  ) {
    return; // デフォルトの挙動（ネットワーク）に任せる
  }

  event.respondWith(respond());

  async function respond() {
    const cache = await caches.open(CACHE);

    // 1. まずキャッシュを確認 (ASSETSに含まれているかに関わらず)
    const cachedResponse = await cache.match(event.request);
    
    // ブラウザモードの場合、最初はここが null になりますが、
    // 下段の fetch 処理によって動的に保存された後はヒットするようになります。
    if (cachedResponse) {
      return cachedResponse;
    }

    // 2. キャッシュがなければネットワークへ
    try {
      const response = await fetch(event.request);

      if (!(response instanceof Response)) {
        throw new Error('invalid response from fetch');
      }

      // 成功レスポンスなら動的にキャッシュに保存（動的キャッシュ）
      if (response.status === 200) {
        // 注: chrome拡張や特定のスキームを除外するため、httpsのみキャッシュするのが安全
        if (url.protocol.startsWith('https')) {
          cache.put(event.request, response.clone());
        }
      }

      return response;
    } catch (err) {
      // ネットワークエラー（オフライン）時の最終手段は上で確認済みなので、
      // ここに到達した時点でキャッシュもなければエラーを投げる
      throw err;
    }
  }
});