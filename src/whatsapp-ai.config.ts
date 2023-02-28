/* Models config files */
import { Config } from './types/Config';

const config: Config = {
    models: {
        ChatGPT: {
            prefix: '!chatgpt',
            enable: true
        },
        DALLE: {
            prefix: '!dalle',
            enable: true
        },
        StableDiffusion: {
            prefix: '!stable',
            enable: true
        },
        Custom: [
            {
                /** Custom Model */
                modelName: 'whatsapp-ai-bot',
                prefix: '!bot',
                enable: true,
                /** 
                 * context: "file-path (.txt, .text, .md)",
                 * context: "text url",
                 * context: "text"
                */
                context: './static/whatsapp-ai-bot.md'
            }
        ]
    },
    enablePrefix: {
        /** if enable, reply to those messages start with prefix  */
        enable: true,
        /** default model to use if message not starts with prefix and enable is false  */
        defaultModel: 'ChatGPT'
    }
};

export default config;

