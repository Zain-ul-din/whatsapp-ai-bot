import { Message } from 'whatsapp-web.js';
import { AiModel } from './AiModel';
import { useSpinner } from '../hooks/useSpinner';
import { Configuration, OpenAIApi } from 'openai';
import { MessageMedia } from 'whatsapp-web.js';

import { MessageTemplates } from '../util/MessageTemplates';
import { ENV } from '../lib/env';

class DalleModel extends AiModel<string> {
    public constructor() {
        super(ENV.openAIKey, 'DALLE');
        this.client = new OpenAIApi(new Configuration({ apiKey: this.apiKey }));
    }

    public async sendMessage(prompt: string, msg: Message): Promise<void> {
        const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, msg.from, prompt));
        spinner.start();
        try {
            const startTime = Date.now();
            const response = await this.client.createImage({
                prompt: prompt,
                n: 1,
                size: '512x512',
                response_format: 'b64_json'
            });

            const base64 = response.data.data[0].b64_json as string;
            const image = new MessageMedia('image/jpeg', base64, 'image.jpg');

            msg.reply(image);
            spinner.succeed(
                MessageTemplates.reqSucceedStr(
                    this.aiModelName,
                    msg.from,
                    image.data,
                    Date.now() - startTime
                )
            );
        } catch (err) {
            spinner.fail(
                MessageTemplates.reqFailStr(
                    this.aiModelName,
                    'at DalleModel.ts sendMessage(prompt, msg)',
                    err
                )
            );
            msg.reply('An error occur please see console for more information.');
        }
    }

    private client;
}

export { DalleModel };
