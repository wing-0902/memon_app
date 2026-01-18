import localforage from 'localforage';
import { browser } from '$app/environment';

// データの型定義
export interface Item {
  displayName: string;
  id: string; // id01, id02など
}

class ItemManager {
  // 1. 配列全体を $state で管理
  items = $state<Item[]>([]);

  constructor() {
    if (browser) {
      this.init();
    }
  }

  private async init() {
    // 2. IndexedDBからデータを読み込み
    const saved = await localforage.getItem<Item[]>('my_items_list');
    if (saved) {
      this.items = saved;
    }

    // 3. 配列の変更を検知して自動保存
    // items 配列の中身（追加・削除・プロパティ変更）を自動で監視します
    $effect.root(() => {
      $effect(() => {
        // items にアクセスすることで依存関係として登録される
        const data = $state.snapshot(this.items);
        localforage.setItem('my_items_list', data).catch(console.error);
      });
    });
  }

  // 操作用メソッド
  addItem(name: string) {
    const newItem = {
      displayName: name,
      id: crypto.randomUUID() // ユニークIDを生成
    };
    this.items.push(newItem);
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  updateName(id: string, newName: string) {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.displayName = newName;
    }
  }
}

export const itemStore = new ItemManager();
