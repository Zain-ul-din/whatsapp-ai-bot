import { AiModel } from './AiModel';
import { ChatGPTAPI } from 'chatgpt';
import type { SendMessageOptions, ChatMessage } from 'chatgpt';
import type { Message } from 'whatsapp-web.js';
import { useSpinner } from '../hooks/useSpinner';
import { MessageTemplates } from '../util/MessageTemplates';

import { ENV } from '../lib/env';

// config file
import config from '../whatsapp-ai.config';
import { IModelType } from '../types/Config';

import fetch from 'node-fetch';
import { readFile } from 'fs/promises';

export type CustomModelProps = { prompt: string; modelName: string };

class CustomModel extends AiModel<CustomModelProps> {
    
    public constructor() {
        super(ENV.openAIKey, 'Custom');
        this.client = new ChatGPTAPI({ apiKey: this.apiKey });
        this.history = {};
    }

    public async sendMessage({ prompt, modelName }: CustomModelProps, msg: Message): Promise<void> {
        const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, msg.from, prompt));
        spinner.start();

        try {
            const customModel = CustomModel.getCustomModel(modelName);
            if (!customModel) return;

            const startTime = Date.now();

            const contextPrompt = CustomModel.createContext(await CustomModel.readContext(customModel), prompt);
            const aiRes = await this.client.sendMessage(
                contextPrompt,
                this.history[msg.from]
            );

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
                    'at CustomModel.ts sendMessage(prompt, msg)',
                    err
                )
            );
            msg.reply('An error occur please see console for more information.');
        }
    }

    private static createContext(context: string, prompt: string) {
        return `
        context:
            ${context}
        note!
            only answer from the given context
            question:
            ${prompt}
        `;
    }

    private static getCustomModel(modelName: string): IModelType | undefined {
        if (!config.models.Custom) return undefined;
        for (let model of config.models.Custom) if (model.modelName == modelName) return model;
        return undefined;
    }

    private static async readContext(model: IModelType) {
        const supportedFiles = ['.txt', '.text', '.md'];
        const httpProtocols = [
            'https://',
            'http://',
            'ftp://',
            'ftps://',
            'sftp://',
            'ssh://',
            'git://',
            'svn://',
            'ws://',
            'wss://'
        ];
        
        if (
            httpProtocols.filter((protocol) => model.context.trim().startsWith(protocol)).length >
            0
        ) {
            const res = await fetch(model.context);
            return res.text();
        }
        
        if (supportedFiles.filter((fileExt) => model.context.trim().endsWith(fileExt)).length > 0) {
            return readFile (model.context, { encoding: "utf-8"});
        } 

        // plane text
        return model.context;
    }

    private client;
    private history: { [from: string]: SendMessageOptions };
}

export { CustomModel };
