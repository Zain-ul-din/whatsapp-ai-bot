export type AiModels = 'ChatGPT' | 'DALLE' | 'StableDiffusion' | 'Gemini' | 'Custom';
export type AiModelsName = Exclude<AiModels, 'Custom'>;
