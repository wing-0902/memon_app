// src/lib/semanticSearch.ts
import { cos_sim, type Tensor } from '@huggingface/transformers';
import { getSimilarity } from './webllm-model';

/**
 * 日本語の意味が解答例とどれだけ一致しているか判定する
 * @param userInput ユーザーが入力した日本語
 * @param correctAnswer アプリ側の正解データ
 * @returns { score: number, isCorrect: boolean }
 */
export async function verifyAnswer(userInput: string, correctAnswer: string) {
  if (!userInput) return { score: 0, isCorrect: false };

  // 1. 類似度の計算
  const score = await getSimilarity(userInput, correctAnswer);

  // 2. 正誤判定の閾値（しきい値）
  // stsb-xlm-r-multilingual の場合、0.8 程度が「言い換え」として妥当なラインです
  const THRESHOLD = 0.82;

  return {
    score,
    isCorrect: score >= THRESHOLD
  };
}
