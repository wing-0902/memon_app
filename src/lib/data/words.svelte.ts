import localforage from 'localforage';

export interface Word {
  id: string;
  front: string;
  back: string;
  createdAt: number;
  lastSeen?: number; // 最後にこの問題を見た日時
  lastResult?: boolean | null; // true: 正解, false: 不正解, null: 未回答
  tryTimes: number; // 挑戦回数
  successTimes: number; // 正解回数
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

  // 単語帳を削除
  async deleteCurrentDeck() {
    if (!this.currentDeckId) {
      console.warn('削除する単語帳が選択されていません。');
      return;
    }

    const deckIdToDelete = this.currentDeckId;

    try {
      // 1. ストレージからデータを削除
      await localforage.removeItem(`words_${deckIdToDelete}`);
      
      // 2. メモリ上のステートをクリア
      this.words = [];
      this.currentDeckId = null;

      console.log(`単語帳 ${deckIdToDelete} を削除しました。`);
    } catch (e) {
      console.error('単語帳の削除に失敗:', e);
      throw e; // 必要に応じてエラーを再送出
    }
  }

  // 単語の追加
  async addWord(front: string, back: string) {
    if (!this.currentDeckId) return;

    const newWord: Word = {
      id: crypto.randomUUID(),
      front,
      back,
      createdAt: Date.now(),
      tryTimes: 0,
      successTimes: 0,
      lastResult: null // 初期状態は未回答
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

  // 正誤を記録
  async recordResult(wordId: string, isCorrect: boolean) {
    const word = this.words.find((w) => w.id === wordId);
    if (word) {
      word.lastSeen = Date.now();
      word.lastResult = isCorrect;
      word.tryTimes += 1;
      if (isCorrect) {
        word.successTimes += 1;
      }
      await this.save();
    }
  }
  constructor() {
    // クラスがインスタンス化された時に一度だけ実行される
    $effect.root(() => {
      $effect(() => {
        // this.words (およびその中身) へのアクセスを検知して
        // 変更があるたびに自動で save() を走らせる
        // JSON.stringify や snapshot を通すと、深い階層まで依存関係として登録されます
        const _dump = $state.snapshot(this.words);
        this.save();
      });
    });
  }
}

export const wordStore = new WordManager();
