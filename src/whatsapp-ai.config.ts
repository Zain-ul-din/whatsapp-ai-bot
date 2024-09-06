/* Models config files */
import { Config } from './types/Config';

const config: Config = {
  chatGPTModel: 'gpt-3.5-turbo', // learn more about GPT models https://platform.openai.com/docs/models
  sendWelcomeMessage: true, // Whether to send a welcome message to the user (located at /src/services/welcomeUser.ts)
  models: {
    ChatGPT: {
      prefix: '!chatgpt', // Prefix for the ChatGPT model
      enable: true // Whether the ChatGPT model is enabled or not
    },
    DALLE3: {
      prefix: '!dalle3', // Prefix for the DALLE-3 model
      enable: true
    },
    DALLE: {
      prefix: '!dalle', // Prefix for the DALLE model
      enable: true // Whether the DALLE model is enabled or not
    },
    StableDiffusion: {
      prefix: '!stable', // Prefix for the StableDiffusion model
      enable: true // Whether the StableDiffusion model is enabled or not
    },
    GeminiVision: {
      prefix: '!gemini-vision', // Prefix for the GeminiVision model
      enable: true // Whether the GeminiVision model is enabled or not
    },
    Gemini: {
      prefix: '!gemini', // Prefix for the Gemini model
      enable: true // Whether the Gemini model is enabled or not
    },
    Custom: [
      {
        /** Custom Model */
        modelName: 'whatsapp-ai-bot', // Name of the custom model
        prefix: '!bot', // Prefix for the custom model
        enable: true, // Whether the custom model is enabled or not
        /**
         * context: "file-path (.txt, .text, .md)",
         * context: "text url",
         * context: "text"
         */
        context: './static/whatsapp-ai-bot.md' // Context for the custom model
      }
    ]
  },
  enablePrefix: {
    /** if enable, reply to those messages start with prefix  */
    enable: true, // Whether prefix messages are enabled or not
    /** default model to use if message not starts with prefix and enable is false  */
    defaultModel: 'ChatGPT' // Default model to use if no prefix is present in the message
  },
  sessionStorage: {
    /** Enable or disable session storage */
    enable: true, // Whether session storage is enabled or not
    /** Session storage path */
    wwjsPath: './' // Path for the session storage
  },
  selfMessage: {
    /** Skip prefix for self messages */
    skipPrefix: false // Whether to skip the prefix for self messages or not
  }
};

export default config;
