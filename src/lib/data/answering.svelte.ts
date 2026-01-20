export const nowCorrectAnswers = $state({
  list: [] as number[], // 正解したやつ一覧（単語帳のIDで管理しよう）
  todo: [] as number[] // 単語テストキュー
});
