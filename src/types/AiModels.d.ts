export type AiModels = 'ChatGPT' | 'DALLE' | 'StableDiffusion' | 'Gemini' | 'GeminiVision' | 'Custom';
export type AiModelsName = Exclude<AiModels, 'Custom'>;
