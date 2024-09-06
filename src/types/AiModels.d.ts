export type AiModels =
  | 'ChatGPT'
  | 'DALLE'
  | 'StableDiffusion'
  | 'Gemini'
  | 'GeminiVision'
  | 'Custom'
  | 'DALLE3'
  | 'FLUX';
export type AiModelsName = Exclude<AiModels, 'Custom'>;
