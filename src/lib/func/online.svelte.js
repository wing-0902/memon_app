import { browser } from '$app/environment';

export function createOnlineStatus() {
  // 1. $state で現在の状態を管理
  let status = $state(browser ? navigator.onLine : true);

  if (browser) {
    // 2. イベントリスナーで、状態変化をリアルタイムにキャッチ
    window.addEventListener('online', () => status = true);
    window.addEventListener('offline', () => status = false);
  }

  // 3. 重要： status そのものを返すとただの「値」としてコピーされるので、
  // ゲッターを使って「現在の status の値」を常に参照させる
  return {
    get isOnline() { return status }
  };
}