export type AiModels = 'ChatGPT' | 'DALLE' | 'StableDiffusion' | 'Custom';
export type AiModelsName = Exclude<AiModels, 'Custom'>;
