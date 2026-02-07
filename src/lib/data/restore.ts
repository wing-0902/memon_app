export async function removeCache() {
  console.log('キャッシュとセッションのみをクリーンアップ開始');

  if (
    !confirm(
      'キャッシュ削除後Appを再度使用するには，一時的にインターネットが必要です．問題ありませんか？'
    )
  )
    return;
  try {
    // サービスワーカーを確実に削除
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => {
          console.log('Service Worker を解除中...');
          return registration.unregister();
        })
      );
    }

    // キャッシュを確実に削除
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          console.log(`Cache 削除中: ${name}`);
          return caches.delete(name);
        })
      );
    }

    // sessionStorage削除
    sessionStorage.clear();

    // ちょっと待ちましょ
    console.log('削除リクエスト完了。解放を待機します...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // リロード
    console.log('リロードを実行します');
    window.location.reload();
  } catch (error) {
    console.error('クリーンアップ中にエラーが発生しました:', error);
    window.location.reload();
  }
}
