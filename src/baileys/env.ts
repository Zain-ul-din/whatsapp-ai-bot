import * as dotenv from 'dotenv';
const configEnv = () => dotenv.config();

configEnv();

interface EnvInterface {
  Debug: boolean;
  Processing: string;

  // Model Services
  API_KEY_OPENAI?: string;
  API_KEY_OPENAI_DALLE?: string;
  API_KEY_DREAMSTUDIO?: string;
  API_KEY_GEMINI?: string;
  API_KEY_HF?: string;

  // MongoDB
  MONGO_ENABLED: boolean;
  MONGO_URL?: string;

  // Services
  // // OpenAI
  OPENAI_PREFIX?: string;
  OPENAI_ENABLED: boolean;
  OPENAI_ICON_PREFIX?: string;

  DALLE_PREFIX?: string;
  DALLE_ENABLED: boolean;
  DALLE_ICON_PREFIX?: string;
  DALLE_USE_3: boolean;

  // // Google Gemini
  GEMINI_PREFIX?: string;
  GEMINI_ENABLED: boolean;
  GEMINI_ICON_PREFIX?: string;
}

export const ENV: EnvInterface = {
  Debug: process.env.DEBUG === 'True',
  Processing: process.env.PROCESSING || 'Processing...',

  API_KEY_OPENAI: process.env.API_KEY_OPENAI,
  API_KEY_OPENAI_DALLE: process.env.API_KEY_OPENAI_DALLE || process.env.API_KEY_OPENAI,
  API_KEY_DREAMSTUDIO: process.env.API_KEY_DREAMSTUDIO,
  API_KEY_GEMINI: process.env.API_KEY_GEMINI,
  API_KEY_HF: process.env.API_KEY_HF,
  MONGO_ENABLED: process.env.MONGO_ENABLED === 'True',
  MONGO_URL: process.env.MONGO_URL,

  OPENAI_PREFIX: process.env.OPENAI_PREFIX,
  OPENAI_ENABLED: process.env.OPENAI_ENABLED === 'True',
  OPENAI_ICON_PREFIX: process.env.OPENAI_ICON_PREFIX,
  DALLE_PREFIX: process.env.DALLE_PREFIX,
  DALLE_ENABLED: process.env.DALLE_ENABLED === 'True',
  DALLE_ICON_PREFIX: process.env.DALLE_ICON_PREFIX,
  DALLE_USE_3: process.env.DALLE_USE_3 === 'True',
  GEMINI_PREFIX: process.env.GEMINI_PREFIX,
  GEMINI_ENABLED: process.env.GEMINI_ENABLED === 'True',
  GEMINI_ICON_PREFIX: process.env.GEMINI_ICON_PREFIX
};
