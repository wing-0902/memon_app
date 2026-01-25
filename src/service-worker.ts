// `HTMLElement`のように，サービスワーカーではDOMにはアクセスできない
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// `$service-worker`からのインポートに正しい型を持たせる
/// <reference types="@sveltejs/kit" />

// `$env/static/public`からのインポートがある場合に必要
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { build, files, version } from '$service-worker';

// `self`に適切な型を持たせる
const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

// デプロイバージョンに一意なキャッシュを作る
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // App自身
	...files  // `static`フォルダの中身全部
];

self.addEventListener('install', (event) => {
	// 新しいキャッシュを作り，全てのファイルを追加
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// 現在のキャッシュを削除
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// POSTリクエストとかは無視
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files`は常にキャッシュから配信して問題ない
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// とりあえずネットワークから取得するが
		// オフラインの場合はキャッシュにフォールバック
		try {
			const response = await fetch(event.request);

			// オフラインの場合，fetchはリクエストではない応答を返すことがあるので
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// もしキャッシュがなかったら
			// どうしようもないのでエラーを返す
			throw err;
		}
	}

	event.respondWith(respond());
});