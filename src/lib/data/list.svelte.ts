import localforage from 'localforage';
import { browser } from '$app/environment';

export interface Item {
  displayName: string;
  id: string;
  createdAt: number;
  is双方向: boolean;
  lastUsed?: number;
}

class ItemManager {
  items = $state<Item[]>([]);
  // 初期化完了フラグ
  isInitialized = $state(false);

  constructor() {
    if (browser) {
      this.init();
    }
  }

  private async init() {
    try {
      const saved = await localforage.getItem<Item[]>('my_items_list');
      if (saved) {
        // 初期データ注入時は保存処理を走らせないために untrack を検討するか、
        // 単に代入してからフラグを立てる
        this.items = saved;
      }
    } catch (e) {
      console.error('Failed to load items:', e);
    } finally {
      this.isInitialized = true;
    }

    // 保存用のエフェクト
    $effect.root(() => {
      $effect(() => {
        if (!this.isInitialized) return;

        // itemsの変更を購読
        const data = $state.snapshot(this.items);

        // デバウンス処理（簡易版）
        const timer = setTimeout(() => {
          localforage.setItem('my_items_list', data);
        }, 500);

        return () => clearTimeout(timer);
      });
    });
  }

  // 名前を一意にする関数
  private getUniqueName(name: string, excludeId?: string): string {
    let finalName = name;
    let counter = 1;

    // 自分以外のアイテムと名前が被っているかチェック
    while (this.items.some(item => item.displayName === finalName && item.id !== excludeId)) {
      counter++;
      finalName = `${name} ${counter}`;
    }
    return finalName;
  }

  addItem(name: string, dual: boolean) {
    const newId = crypto.randomUUID();
    this.items.push({
      displayName: this.getUniqueName(name),
      id: newId,
      createdAt: Date.now(),
      is双方向: dual
    });
    return newId;
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  updateName(id: string, newName: string) {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.displayName = this.getUniqueName(newName, id);
    }
  }
}

export const itemStore = new ItemManager();
