import * as dotenv from 'dotenv';
const configEnv = () => dotenv.config();

configEnv();

interface EnvInterface {
  Debug: boolean;

  // Model Services
  API_KEY_OPENAI: string | undefined;
  API_KEY_OPENAI_DALLE: string | undefined;
  API_KEY_DREAMSTUDIO: string | undefined;
  API_KEY_GEMINI: string | undefined;
  API_KEY_HF: string | undefined;

  // MongoDB
  MONGO_URL: string | undefined;

  // Services
  // // OpenAI
  OPENAI_PREFIX: string | undefined;
  OPENAI_ENABLED: boolean;

  DALLE_PREFIX: string | undefined;
  DALLE_ENABLED: boolean;
  DALLE_USE_3: boolean;
}

export const ENV: EnvInterface = {
  API_KEY_OPENAI: process.env.OPENAI_API_KEY,
  API_KEY_OPENAI_DALLE: process.env.OPENAI_DALLE_API_KEY || process.env.OPENAI_API_KEY,
  API_KEY_DREAMSTUDIO: process.env.DREAMSTUDIO_API_KEY,
  API_KEY_GEMINI: process.env.GEMINI_API_KEY,
  API_KEY_HF: process.env.HF_TOKEN,
  MONGO_URL: process.env.MONGO_URL,

  Debug: process.env.DEBUG === 'True',

  OPENAI_PREFIX: process.env.OPENAI_PREFIX,
  OPENAI_ENABLED: process.env.OPENAI_ENABLED === 'True',
  DALLE_PREFIX: process.env.DALLE_PREFIX,
  DALLE_ENABLED: process.env.DALLE_ENABLED === 'True',
  DALLE_USE_3: process.env.DALLE_USE_3 === 'True'
};
