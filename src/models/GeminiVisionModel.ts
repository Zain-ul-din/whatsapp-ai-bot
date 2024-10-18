import { AIModel } from './BaseAiModel';
import { ENV } from '../baileys/env';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSpinner } from '../hooks/useSpinner';
import { MessageTemplates } from '../util/MessageTemplates';

interface GeminiVisionModelParams {
  sender: string;
  prompt: { prompt: string; buffer: Buffer; mimeType: string };
}

type HandleType = (res: string, error?: string) => Promise<void>;

class GeminiVisionModel extends AIModel<GeminiVisionModelParams, HandleType> {
  public constructor() {
    super(ENV.geminiKey, 'GeminiVision', 'Image');
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  async sendMessage({ sender, prompt }: GeminiVisionModelParams, handle: HandleType): Promise<any> {
    const spinner = useSpinner(
      MessageTemplates.requestStr(this.aiModelName, sender, '<image data>')
    );
    spinner.start();

    try {
      const startTime = Date.now();

      // check out more at: https://ai.google.dev/tutorials/node_quickstart
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const imageParts = [this.toGenerativePart(prompt.buffer, prompt.mimeType)];
      const result = await model.generateContent([prompt.prompt, ...imageParts]);
      const resText = result.response.text();

      await handle(resText);

      spinner.succeed(
        MessageTemplates.reqSucceedStr(this.aiModelName, sender, resText, Date.now() - startTime)
      );
    } catch (err) {
      spinner.fail(
        MessageTemplates.reqFailStr(
          this.aiModelName,
          'at GeminiVisionModel.ts sendMessage(prompt, msg)',
          err
        )
      );
      await handle('', 'An error occur please see console for more information.');
    }
  }

  private toGenerativePart(buffer: Buffer, mimeType: string) {
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType
      }
    };
  }

  private genAI: GoogleGenerativeAI;
}

export { GeminiVisionModel };
