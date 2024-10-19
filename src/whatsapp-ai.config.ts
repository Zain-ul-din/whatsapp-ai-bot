/* Models config files */
import { Config } from './types/Config';
import { ENV } from './baileys/env';

const config: Config = {
  sendWelcomeMessage: true, // Whether to send a welcome message to the user (located at /src/services/welcomeUser.ts)
  models: {
    ChatGPT: {
      prefix: ENV.OPENAI_PREFIX,
      enable: ENV.OPENAI_ENABLED,
      modelToUse: 'gpt-3.5-turbo', // See all models here https://platform.openai.com/docs/models
      settings: {
        dalle_enabled: ENV.DALLE_ENABLED,
        dalle_prefix: ENV.DALLE_PREFIX,
        dalle_use_3: ENV.DALLE_USE_3
      }
    },
    Gemini: {
      prefix: ENV.GEMINI_PREFIX,
      enable: ENV.GEMINI_ENABLED
    },
    FLUX: {
      prefix: ENV.HF_PREFIX,
      enable: ENV.HF_ENABLED
    }
    /*
    Custom: [
      {
        // Custom Model
        modelName: 'whatsapp-ai-bot', // Name of the custom model
        prefix: '!bot', // Prefix for the custom model
        enable: true, // Whether the custom model is enabled or not
        //
        // context: "file-path (.txt, .text, .md)",
        // context: "text url",
        // context: "text"
        
        context: './static/whatsapp-ai-bot.md' // Context for the custom model
      }
    ]
      */
  },
  prefix: {
    enabled: true, // If you disable this, the bot will reply to all messages
    defaultModel: 'ChatGPT'
  },
  sessionStorage: {
    enable: true, // We should save the session storage?
    wwjsPath: './'
  },
  selfMessage: {
    /** Skip prefix for self messages */
    skipPrefix: false // Whether to skip the prefix for self messages or not
  }
};

export default config;
