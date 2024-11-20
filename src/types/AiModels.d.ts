export type AIModels = 'ChatGPT' | 'Gemini' | 'FLUX' | 'Stability' | 'Dalle' | 'Custom';
export type AIModelsName = Exclude<AIModels, 'Custom'>;
