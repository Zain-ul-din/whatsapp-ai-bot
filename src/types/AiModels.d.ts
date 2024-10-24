export type AIModels = 'ChatGPT' | 'Gemini' | 'FLUX' | 'Stability' | 'Dalle' ;
export type AIModelsName = Exclude<AIModels, 'Custom'>;
