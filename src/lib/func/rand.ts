export function getRandomElements(n: number, x: number) {
  // 1. 1からnまでの配列を作成
  const numbers = Array.from({ length: n }, (_, i) => i + 1);

  // 2. Fisher-Yates シャッフルをx回分だけ実行
  for (let i = 0; i < x; i++) {
    const randomIndex = Math.floor(Math.random() * (n - i)) + i;
    // 要素を入れ替える
    [numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]];
  }

  // 3. 先頭からx個を取り出す
  return numbers.slice(0, x);
}

// number[]型の変数が返る

// 使用例：1〜100の中から5個選ぶ
// console.log(getRandomElements(100, 5));
