import { AiModel } from './AiModel';
import { generateAsync } from 'stability-client';
import { useSpinner } from '../hooks/useSpinner';
import type { Message } from 'whatsapp-web.js';
import { MessageMedia } from 'whatsapp-web.js';

import { MessageTemplates } from '../util/MessageTemplates';
import { ENV } from '../lib/env';

class StabilityModel extends AiModel<string> {
    public constructor() {
        super(ENV.dreamStudioKey, 'StableDiffusion');
    }

    public async sendMessage(prompt: string, msg: Message): Promise<void> {
        const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, msg.from, prompt));
        spinner.start();

        try {
            const startTime = Date.now();

            const res: any = await generateAsync({
                prompt,
                apiKey: this.apiKey,
                width: 512,
                height: 512
            });

            // generate image
            const res_img = res.images[0];
            const buffer = Buffer.from(res_img.buffer, 'hex'); // since MessageMedia require  base_64 image
            const base64String = buffer.toString('base64');
            const image = new MessageMedia('image/jpeg', base64String, 'image.jpg');

            msg.reply(image);
            spinner.succeed(
                MessageTemplates.reqSucceedStr(
                    this.aiModelName,
                    msg.from,
                    res.images,
                    Date.now() - startTime
                )
            );
        } catch (err) {
            spinner.fail(
                MessageTemplates.reqFailStr(
                    this.aiModelName,
                    'at StabilityModel.ts sendMessage(prompt, msg)',
                    err
                )
            );
            msg.reply('An error occur please see console for more information.');
        }
    }
}

export { StabilityModel };
