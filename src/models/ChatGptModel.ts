import { AiModel } from './AiModel';
import { ChatGPTAPI } from 'chatgpt';
import type { SendMessageOptions, ChatMessage } from 'chatgpt';
import type { Message } from 'whatsapp-web.js';
import { useSpinner } from '../hooks/useSpinner';
import { MessageTemplates } from '../util/MessageTemplates';

import { ENV } from '../lib/env';

class ChatGptModel extends AiModel<string> {
    public constructor() {
        super(ENV.openAIKey, 'ChatGPT');
        this.client = new ChatGPTAPI({ 
            apiKey: this.apiKey
        });
        this.history = {};
    }
    
    public async sendMessage(prompt: string, msg: Message): Promise<void> {
        const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, msg.from, prompt));
        spinner.start();
        try {
            const startTime = Date.now();
            const aiRes = await this.client.sendMessage(prompt, this.history[msg.from]);

            this.history[msg.from as keyof SendMessageOptions] = {
                conversationId: aiRes.conversationId,
                parentMessageId: aiRes.id
            };

            msg.reply(aiRes.text);
            spinner.succeed(
                MessageTemplates.reqSucceedStr(
                    this.aiModelName,
                    msg.from,
                    aiRes.text,
                    Date.now() - startTime
                )
            );
        } catch (err) {
            spinner.fail(
                MessageTemplates.reqFailStr(
                    this.aiModelName,
                    'at ChatGptModel.ts sendMessage(prompt, msg)',
                    err
                )
            );
            msg.reply('An error occur please see console for more information.');
        }
    }

    private client;
    private history: { [from: string]: SendMessageOptions };
}

export { ChatGptModel };
