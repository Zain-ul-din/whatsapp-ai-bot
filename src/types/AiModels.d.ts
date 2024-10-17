export type AiModels =
  | 'ChatGPT'
  | 'Gemini'
  | 'Custom'
  | 'FLUX';

export type AiModelsName = Exclude<AiModels, 'Custom'>;
