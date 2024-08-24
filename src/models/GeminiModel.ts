import { AiModel } from './AiModel';
import { ENV } from '../lib/env';
import { useSpinner } from '../hooks/useSpinner';
import { MessageTemplates } from '../util/MessageTemplates';
import { Content, GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiModelParams {
  sender: string;
  prompt: string;
}

type HandleType = (res: string, error?: string) => Promise<void>;

class GeminiModel extends AiModel<GeminiModelParams, HandleType> {
  public constructor() {
    super(ENV.geminiKey, 'Gemini');
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.history = {};
  }

  async sendMessage({ sender, prompt }: GeminiModelParams, handle: HandleType): Promise<any> {
    const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, sender, prompt));
    spinner.start();

    try {
      const startTime = Date.now();

      // check out more at: https://ai.google.dev/tutorials/node_quickstart
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const chat = model.startChat({
        history: this.history[sender]
      });

      const res = await chat.sendMessage(prompt);

      // TODO: handle usage metadata

      const resText = res.response.text();

      // push conversation to history
      if (this.history[sender] === undefined) this.history[sender] = [];
      this.history[sender].push({ role: 'user', parts: [{ text: prompt }] });
      this.history[sender].push({ role: 'model', parts: [{ text: resText }] });

      await handle(resText);

      spinner.succeed(
        MessageTemplates.reqSucceedStr(this.aiModelName, sender, resText, Date.now() - startTime)
      );
    } catch (err) {
      spinner.fail(
        MessageTemplates.reqFailStr(
          this.aiModelName,
          'at GeminiModel.ts sendMessage(prompt, msg)',
          err
        )
      );
      handle('', 'An error occur please see console for more information.');
    }
  }

  private genAI: GoogleGenerativeAI;
  private history: { [sender: string]: Content[] };
}

export { GeminiModel };
