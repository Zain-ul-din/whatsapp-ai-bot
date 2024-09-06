import { AiModel } from './AiModel';
import { useSpinner } from '../hooks/useSpinner';
import OpenAI from 'openai';

import { MessageTemplates } from '../util/MessageTemplates';
import { ENV } from '../lib/env';

interface DalleModelParams {
  sender: string;
  prompt: string;
}

type HandleType = (
  { url, caption }: { url: string; caption?: string },
  error?: string
) => Promise<void>;

class DalleModel extends AiModel<DalleModelParams, {}> {
  public constructor(modelName: 'DALLE' | 'DALLE3') {
    super(ENV.openAIKey, modelName);
    this.client = new OpenAI({ apiKey: this.apiKey });
  }

  public async sendMessage(
    { sender, prompt }: DalleModelParams,
    handle: HandleType
  ): Promise<void> {
    const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, sender, prompt));
    spinner.start();
    try {
      const startTime = Date.now();

      const res = await this.client.images.generate({
        model: this.aiModelName === 'DALLE3' ? 'dall-e-3' : 'dall-e-2',
        n: 1,
        size: '512x512',
        prompt
      });

      await handle({ url: res.data[0].url as string, caption: res.data[0].revised_prompt });

      spinner.succeed(
        MessageTemplates.reqSucceedStr(
          this.aiModelName,
          sender,
          res.data[0].url as string,
          Date.now() - startTime
        )
      );
    } catch (err) {
      spinner.fail(
        MessageTemplates.reqFailStr(
          this.aiModelName,
          'at DalleModel.ts sendMessage(prompt, handle)',
          err
        )
      );
      await handle({ url: '' }, 'An error occur please see console for more information.');
    }
  }

  private client: OpenAI;
}

export { DalleModel };
