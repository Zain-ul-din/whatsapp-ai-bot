/* Models config files */
import { Config } from './types/Config';
import { ENV } from './baileys/env';

const config: Config = {
  sendWelcomeMessage: true, // Whether to send a welcome message to the user (located at /src/services/welcomeUser.ts)
  models: {
    ChatGPT: {
      prefix: ENV.OPENAI_PREFIX,
      enable: ENV.OPENAI_ENABLED
    },
    Dalle: {
      prefix: ENV.DALLE_PREFIX,
      enable: ENV.DALLE_ENABLED
    },
    Gemini: {
      prefix: ENV.GEMINI_PREFIX,
      enable: ENV.GEMINI_ENABLED
    },
    FLUX: {
      prefix: ENV.HF_PREFIX,
      enable: ENV.HF_ENABLED
    },
    Stability: {
      prefix: ENV.STABILITY_PREFIX,
      enable: ENV.STABILITY_ENABLED
    },
    Ollama: {
      prefix: ENV.OLLAMA_PREFIX,
      enable: ENV.OLLAMA_ENABLED
    },
    Custom: [
      // custom model
      {
        modelName: 'whatsapp-ai-bot',
        prefix: '!wa',
        enable: true,
        //
        // context: "file-path (.txt, .text, .md)",
        // context: "text url",
        // context: "text"
        context: './docs/wa-ai-bot.md',
        baseModel: 'Gemini'
      }
    ]
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
