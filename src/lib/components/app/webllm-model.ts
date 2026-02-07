import {
  pipeline,
  cos_sim,
  env,
  type FeatureExtractionPipeline,
  type Tensor
} from '@huggingface/transformers';

env.allowRemoteModels = false;
env.localModelPath = '/bypass-service-worker/webllm-models/';
env.backends.onnx.wasm.wasmPaths = '/bypass-service-worker/webllm-wasm/';

let modelInstance: FeatureExtractionPipeline | null = null;

// 生存確認
export function isModelLoaded(): boolean {
  return modelInstance !== null;
}

// initialize LLM
export async function initModel(progress_callback?: (progress: any) => void): Promise<void> {
  if (modelInstance) return;

  const pipe = await pipeline('feature-extraction', 'Xenova/stsb-xlm-r-multilingual', {
    progress_callback
  });

  modelInstance = pipe as unknown as FeatureExtractionPipeline;
}

// 一致度を計算
export async function getSimilarity(text1: string, text2: string): Promise<number> {
  if (!modelInstance) {
    throw new Error('モデルが初期化されていません。');
  }

  const out1 = (await modelInstance(text1, { pooling: 'mean', normalize: true })) as Tensor;
  const out2 = (await modelInstance(text2, { pooling: 'mean', normalize: true })) as Tensor;

  // Array.from() で Float32Array を number[] に変換
  const score = cos_sim(
    Array.from(out1.data as Float32Array),
    Array.from(out2.data as Float32Array)
  );

  return score;
}
