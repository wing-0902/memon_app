import localforage from 'localforage';

export interface Word {
  id: string;
  front: string; // 表（単語）
  back: string; // 裏（意味）
  createdAt: number;
}

class WordManager {
  // 現在開いている単語帳の単語リスト
  words = $state<Word[]>([]);
  // 読み込み中フラグ
  isLoading = $state(false);
  // 現在の単語帳ID
  currentDeckId = $state<string | null>(null);

  // 単語帳を開く（読み込み）
  async load(deckId: string) {
    this.isLoading = true;
    this.currentDeckId = deckId;
    try {
      const saved = await localforage.getItem<Word[]>(`words_${deckId}`);
      this.words = saved || [];
    } catch (e) {
      console.error('単語の読み込みに失敗:', e);
      this.words = [];
    } finally {
      this.isLoading = false;
    }
  }

  // 単語の追加
  async addWord(front: string, back: string) {
    if (!this.currentDeckId) return;

    const newWord: Word = {
      id: crypto.randomUUID(),
      front,
      back,
      createdAt: Date.now()
    };

    this.words.push(newWord);
    await this.save();
  }

  // 単語の削除
  async removeWord(wordId: string) {
    this.words = this.words.filter((w) => w.id !== wordId);
    await this.save();
  }

  // 保存処理
  private async save() {
    if (this.currentDeckId) {
      await localforage.setItem(`words_${this.currentDeckId}`, $state.snapshot(this.words));
    }
  }

  // 画面を離れる時にクリア
  clear() {
    this.words = [];
    this.currentDeckId = null;
  }
}

export const wordStore = new WordManager();
