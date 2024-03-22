import { AiModel } from './AiModel';
import type { Message } from 'whatsapp-web.js';
import { useSpinner } from '../hooks/useSpinner';
import { MessageTemplates } from '../util/MessageTemplates';

// config file
import config from '../whatsapp-ai.config';
import { IModelType } from '../types/Config';

import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { AiModelsName } from '../types/AiModels';

export type CustomModelProps = { 
    prompt: string; modelName: string,
    resolve: (model: AiModelsName, prompt: string)=> Promise<void>
};

class CustomModel extends AiModel<CustomModelProps> {
    public constructor() {
        super('', 'Custom')
    }
    
    public async sendMessage({ prompt, modelName, resolve }: CustomModelProps, msg: Message): Promise<void> {
        const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, msg.from, prompt));

        try {
            const customModel = CustomModel.getCustomModel(modelName);
            
            if (!customModel) return;
            
            let sender = ''
            if (customModel.includeSender)
            {
                const chat = await msg.getChat();
                sender = `sender: ${chat.name}`;
            }
            
            const contextPrompt = CustomModel.createContext(
                await CustomModel.readContext(customModel),
                prompt.replace(customModel.prefix, ''),
                sender
            );
            
            resolve(customModel.modelToUse || 'Gemini', contextPrompt);

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

    private static createContext(context: string, prompt: string, sender: string = '') {
        return `
        ${sender} 
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
        return config.models.Custom[0];
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
            httpProtocols.filter((protocol) => model.context.trim().startsWith(protocol)).length > 0
        ) {
            const res = await fetch(model.context);
            return res.text();
        }

        if (supportedFiles.filter((fileExt) => model.context.trim().endsWith(fileExt)).length > 0) {
            return readFile(model.context, { encoding: 'utf-8' });
        }

        // plane text
        return model.context;
    }
}

export { CustomModel };
