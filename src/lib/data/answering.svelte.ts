export const nowCorrectAnswers = $state({
  list: [] as number[], // 正解したやつ一覧（単語帳のIDで管理しよう，0からn-1まで）
  todo: [] as number[] // 単語テストキュー（1からnまで）
});
