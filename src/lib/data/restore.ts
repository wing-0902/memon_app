export async function removeCache() {
  console.log('クリーンアップを開始');

  // sessionStorageをクリア
  sessionStorage.clear();

  console.log('セッションストレージをクリア済');

  // サービスワーカーを解除
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) {
      const result = await registration.unregister();
      console.log(`Service Worker 解除: ${result}`);
    }
  }

  // キャッシュストレージをクリア
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    for (let name of cacheNames) {
      const result = await caches.delete(name);
      console.log(`Cache 削除 [${name}]: ${result}`);
    }
  }

  // リロード
  console.log("リロードを実行します");
  window.location.reload();
}
