/* Third-party modules */
import { ChatCompletionMessageParam, ChatCompletionMessage } from 'openai/resources/chat/completions';
import OpenAI from 'openai';

/* Local modules */
import { AiModel, AIArguments } from './BaseAiModel';
import { ENV } from '../baileys/env';
import config from '../whatsapp-ai.config';

type HandleType = (res: string, error?: string) => Promise<void>;

class ChatGPTModel extends AiModel<AIArguments, HandleType> {
  private history: { [from: string]: ChatCompletionMessageParam[] };
  private Dalle3: boolean;
  private Dalle: OpenAI;
  private OpenAI: OpenAI;

  public constructor() {
    super(ENV.API_KEY_OPENAI, 'ChatGPT');

    this.OpenAI = new OpenAI({
      apiKey: this.getApiKey()
    });

    this.Dalle = new OpenAI({
      apiKey: ENV.API_KEY_OPENAI_DALLE
    });

    this.history = {};
    this.Dalle3 = ENV.DALLE_USE_3;
  }

  public sessionCreate(user: string): void { this.history[user] = [] };
  public sessionExists(user: string): boolean { return this.history[user] !== undefined };
  public sessionAddMessage(user: string, args: any): void { this.history[user].push(args) };

  public async generateCompletion(user: string): Promise<ChatCompletionMessage> {
    const completion = await this.OpenAI.chat.completions.create({
      messages: this.history[user],
      model: config.chatGPTModel
    });

    const message = completion.choices[0].message;
    this.history[user].push(message);

    return message;
  }

  public async generateImage() {

  }

  public async sendMessage({ sender, prompt }: AIArguments, handle: HandleType): Promise<any> {
    try {
      if ( !this.sessionExists(sender) ) { this.sessionCreate(sender) };

      this.sessionAddMessage(sender, { role: 'user', content: prompt });

      const completion = await this.generateCompletion(sender);

      const res = completion.content || '';
      await handle(res);
    } catch (err) {
      await handle('', 'An error occur please see console for more information.');
    }
  }
}

export { ChatGPTModel };