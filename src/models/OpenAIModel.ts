/* Third-party modules */
import { ChatCompletionMessage } from 'openai/resources/chat/completions';
import { Image, ImagesResponse } from 'openai/resources';
import OpenAI from 'openai';

/* Local modules */
import { AIModel, AIArguments, AIHandle } from './BaseAiModel';
import { ENV } from '../baileys/env';
import config from '../whatsapp-ai.config';

/* Util */
interface BotImageResponse {
  image: Buffer;
  caption: string;
}

type DalleSizeImage = '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | null;

/* ChatGPT Model */
class ChatGPTModel extends AIModel<AIArguments, AIHandle> {
  /* Variables */
  private Dalle3: boolean;
  private Dalle: OpenAI;
  private OpenAI: OpenAI;
  public DalleSize: DalleSizeImage;

  public instructions: string | undefined = undefined;

  public constructor() {
    super(ENV.API_KEY_OPENAI, 'ChatGPT');

    this.OpenAI = new OpenAI({
      apiKey: this.getApiKey()
    });

    this.Dalle = new OpenAI({
      apiKey: ENV.API_KEY_OPENAI_DALLE || ENV.API_KEY_OPENAI
    });

    this.Dalle3 = ENV.DALLE_USE_3;
    this.DalleSize = ENV.DALLE_SIZE as DalleSizeImage;
  }

  /* Methods */
  public async generateCompletion(user: string): Promise<ChatCompletionMessage> {
    const completion = await this.OpenAI.chat.completions.create({
      messages: [
        ...(this.instructions ? [{ role: 'system', content: this.instructions }] : []),
        ...this.history[user]
      ],
      model: ENV.OPENAI_MODEL
    });

    const message = completion.choices[0].message;
    this.history[user].push(message);

    return message;
  }

  public async generateImage(prompt: string): Promise<BotImageResponse> {
    const res: ImagesResponse = await this.Dalle.images.generate({
      model: this.Dalle3 ? 'dall-e-3' : 'dall-e-2',
      n: 1,
      size: this.DalleSize,
      prompt: prompt,
      response_format: 'b64_json'
    });

    const image: Image = res.data[0];
    const base64Img = Buffer.from(image.b64_json as string, 'base64');

    return { image: base64Img, caption: image.revised_prompt || prompt };
  }

  public async sendMessage({ sender, prompt, prefix }: AIArguments, handle: AIHandle) {
    try {
      // Use Dalle
      if (ENV.DALLE_ENABLED && prefix === ENV.DALLE_PREFIX) {
        const res = await this.generateImage(prompt);
        await handle(res);

        // Use ChatGPT
      } else {
        if (!this.sessionExists(sender)) {
          this.sessionCreate(sender);
        }
        this.sessionAddMessage(sender, { role: 'user', content: prompt });

        const completion = await this.generateCompletion(sender);
        const res = completion.content || '';
        await handle({ text: res });
      }
    } catch (err) {
      await handle('', err as string);
    }
  }
}

export { ChatGPTModel };
