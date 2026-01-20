export const nowCorrectAnswers = $state({
  list: [] as number[], // 正解したやつ一覧（単語帳のIDで管理しよう，0からn-1まで）
  wrongList: [] as number[], // 間違ったやつ
  todo: [] as number[], // 単語テストキュー（1からnまで）
});
