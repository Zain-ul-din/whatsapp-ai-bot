import * as dotenv from 'dotenv';
const configEnv = () => dotenv.config();

configEnv();

interface EnvInterface {
  Debug: boolean;
  Processing: string;
  IGNORE_SELF_MESSAGES: boolean;

  // Model Services
  API_KEY_OPENAI?: string;
  API_KEY_OPENAI_DALLE?: string;
  API_KEY_DREAMSTUDIO?: string;
  API_KEY_GEMINI?: string;
  API_KEY_HF?: string;
  API_KEY_STABILITY?: string;

  // MongoDB
  MONGO_ENABLED: boolean;
  MONGO_URL?: string;

  // Services
  // // OpenAI
  OPENAI_MODEL: string;
  OPENAI_PREFIX?: string;
  OPENAI_ENABLED: boolean;
  OPENAI_ICON_PREFIX?: string;

  DALLE_PREFIX?: string;
  DALLE_ENABLED: boolean;
  DALLE_ICON_PREFIX?: string;
  DALLE_USE_3: boolean;
  DALLE_SIZE: string;

  // // Google Gemini
  GEMINI_PREFIX?: string;
  GEMINI_ENABLED: boolean;
  GEMINI_ICON_PREFIX?: string;

  // // Hugging Face
  HF_PREFIX?: string;
  HF_ENABLED: boolean;
  HF_ICON_PREFIX?: string;

  // // Stability
  STABILITY_PREFIX?: string;
  STABILITY_ENABLED: boolean;
  STABILITY_ICON_PREFIX?: string;
  STABILITY_MODEL: string;

  OLLAMA_PREFIX?: string;
  OLLAMA_ENABLED: boolean;
}

export const ENV: EnvInterface = {
  Debug: process.env.DEBUG === 'True',
  Processing: process.env.PROCESSING || 'Processing...',
  IGNORE_SELF_MESSAGES: process.env.IGNORE_SELF_MESSAGES === 'True',

  API_KEY_OPENAI: process.env.API_KEY_OPENAI,
  API_KEY_OPENAI_DALLE: process.env.API_KEY_OPENAI_DALLE || process.env.API_KEY_OPENAI,
  API_KEY_DREAMSTUDIO: process.env.API_KEY_DREAMSTUDIO,
  API_KEY_GEMINI: process.env.API_KEY_GEMINI,
  API_KEY_HF: process.env.API_KEY_HF,
  API_KEY_STABILITY: process.env.API_KEY_STABILITY,

  MONGO_ENABLED: process.env.MONGO_ENABLED === 'True',
  MONGO_URL: process.env.MONGO_URL,

  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  OPENAI_PREFIX: process.env.OPENAI_PREFIX,
  OPENAI_ENABLED: process.env.OPENAI_ENABLED === 'True',
  OPENAI_ICON_PREFIX: process.env.OPENAI_ICON_PREFIX,

  DALLE_PREFIX: process.env.DALLE_PREFIX,
  DALLE_ENABLED: process.env.DALLE_ENABLED === 'True',
  DALLE_ICON_PREFIX: process.env.DALLE_ICON_PREFIX,
  DALLE_USE_3: process.env.DALLE_USE_3 === 'True',
  DALLE_SIZE: process.env.DALLE_SIZE || '512x512',

  GEMINI_PREFIX: process.env.GEMINI_PREFIX,
  GEMINI_ENABLED: process.env.GEMINI_ENABLED === 'True',
  GEMINI_ICON_PREFIX: process.env.GEMINI_ICON_PREFIX,

  HF_PREFIX: process.env.HF_PREFIX,
  HF_ENABLED: process.env.HF_ENABLED === 'True',
  HF_ICON_PREFIX: process.env.HF_ICON_PREFIX,

  STABILITY_PREFIX: process.env.STABILITY_PREFIX,
  STABILITY_ENABLED: process.env.STABILITY_ENABLED === 'True',
  STABILITY_ICON_PREFIX: process.env.STABILITY_ICON_PREFIX,
  STABILITY_MODEL: process.env.STABILITY_MODEL || 'core',

  OLLAMA_PREFIX: process.env.OLLAMA_PREFIX,
  OLLAMA_ENABLED: process.env.OLLAMA_ENABLED === 'True'
};
