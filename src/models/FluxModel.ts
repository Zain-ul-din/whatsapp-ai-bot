import { useSpinner } from '../hooks/useSpinner';
import { ENV } from '../baileys/env';
import { MessageTemplates } from '../util/MessageTemplates';
import { AiModel } from './BaseAiModel';

interface FluxAiModelParams {
  sender: string;
  prompt: string;
}

type HandleType = (res: Buffer, err?: string) => Promise<void>;

class FluxModel extends AiModel<FluxAiModelParams, HandleType> {
  constructor() {
    super(ENV.HFKey, 'FLUX');
  }

  async sendMessage({ sender, prompt }: FluxAiModelParams, handle: HandleType): Promise<any> {
    const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, sender, prompt));
    spinner.start();
    try {
      const startTime = Date.now();

      const response = await fetch(
        'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: prompt
          })
        }
      );

      const buffer = await (await response.blob()).arrayBuffer();
      const base64Img = Buffer.from(buffer);

      await handle(base64Img);

      spinner.succeed(
        MessageTemplates.reqSucceedStr(
          this.aiModelName,
          sender,
          '<Image Buffer>',
          Date.now() - startTime
        )
      );
    } catch (err) {
      spinner.fail(
        MessageTemplates.reqFailStr(
          this.aiModelName,
          'at FluxModel.ts sendMessage(prompt, msg)',
          err
        )
      );
      await handle(Buffer.from(''), 'An error occur please see console for more information.');
    }
  }
}

export { FluxModel };
