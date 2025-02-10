export type AIModels = 'ChatGPT' | 'Gemini' | 'FLUX' | 'Stability' | 'Dalle' | 'Ollama' | 'Custom';
export type AIModelsName = Exclude<AIModels, 'Custom'>;
