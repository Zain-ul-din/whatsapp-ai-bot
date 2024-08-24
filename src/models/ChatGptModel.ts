import { AiModel } from './AiModel';
import { useSpinner } from '../hooks/useSpinner';
import { MessageTemplates } from '../util/MessageTemplates';

import { ENV } from '../lib/env';
import config from '../whatsapp-ai.config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface ChatGptModelParams {
  sender: string;
  prompt: string;
}

type HandlerType = (res: string, error?: string) => Promise<void>;

class ChatGptModel extends AiModel<ChatGptModelParams, HandlerType> {
  public constructor() {
    super(ENV.openAIKey, 'ChatGPT');
    this.openai = new OpenAI({
      apiKey: this.apiKey
    });

    this.history = {};
  }

  public async sendMessage(
    { prompt, sender }: ChatGptModelParams,
    handler: HandlerType
  ): Promise<void> {
    const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, sender, prompt));
    spinner.start();
    try {
      const startTime = Date.now();

      if (this.history[sender] === undefined) this.history[sender] = [];
      this.history[sender].push({ role: 'user', content: prompt });

      const completion = await this.openai.chat.completions.create({
        messages: this.history[sender],
        model: config.chatGPTModel
      });

      // TODO: Get Total tokens, Get finish reason

      const message = completion.choices[0].message;
      this.history[sender].push(message);

      const res = message.content || '';
      await handler(res);

      spinner.succeed(
        MessageTemplates.reqSucceedStr(this.aiModelName, sender, res, Date.now() - startTime)
      );
    } catch (err) {
      spinner.fail(
        MessageTemplates.reqFailStr(
          this.aiModelName,
          'at ChatGptModel.ts sendMessage(prompt, msg)',
          err
        )
      );
      await handler('', 'An error occur please see console for more information.');
    }
  }

  private history: { [from: string]: ChatCompletionMessageParam[] };
  private openai: OpenAI;
}

export { ChatGptModel };
