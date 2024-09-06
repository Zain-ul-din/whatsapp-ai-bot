export type AiModels =
  | 'ChatGPT'
  | 'DALLE'
  | 'StableDiffusion'
  | 'Gemini'
  | 'GeminiVision'
  | 'Custom'
  | 'DALLE3';
export type AiModelsName = Exclude<AiModels, 'Custom'>;
