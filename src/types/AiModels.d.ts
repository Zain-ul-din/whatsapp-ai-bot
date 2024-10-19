export type AIModels = 'ChatGPT' | 'Gemini' | 'FLUX' | 'Stability';
export type AIModelsName = Exclude<AIModels, 'Custom'>;
