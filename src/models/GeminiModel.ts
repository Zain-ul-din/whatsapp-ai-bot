/* Third-party modules */
import {
  ChatSession,
  InlineDataPart,
  GenerativeModel,
  GoogleGenerativeAI
} from '@google/generative-ai';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

/* Local modules */
import { AIModel, AIArguments, AIHandle, AIMetaData } from './BaseAiModel';
import { ENV } from '../baileys/env';
import invariant from 'invariant';

/* Gemini Model */
class GeminiModel extends AIModel<AIArguments, AIHandle> {
  /* Variables */
  private generativeModel?: GenerativeModel;
  private Gemini: GoogleGenerativeAI;
  public chats: { [from: string]: ChatSession };
  public instructions: string | undefined;

  public constructor() {
    super(ENV.API_KEY_GEMINI, 'Gemini', ENV.GEMINI_ICON_PREFIX);
    this.Gemini = new GoogleGenerativeAI(ENV.API_KEY_GEMINI as string);
    this.chats = {};
  }

  /* Methods */
  public async generateCompletion(user: string, prompt: string): Promise<string> {
    if (!this.sessionExists(user)) {
      this.sessionCreate(user);
      this.chats[user] = this.generativeModel!.startChat();
    }

    const chat = this.chats[user];
    return (await chat.sendMessage(prompt)).response.text();
  }

  public createGenerativeContent(buffer: Buffer, mimeType: string): InlineDataPart {
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType
      }
    };
  }

  private initGenerativeModel() {
    // https://ai.google.dev/gemini-api/docs/models/gemini
    this.generativeModel = this.Gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: this.instructions
    });
  }

  public async generateImageCompletion(prompt: string, metadata: AIMetaData): Promise<string> {
    this.initGenerativeModel();
    invariant(this.generativeModel, 'Unable to initialize Gemini Generative model');

    const { mimeType } = metadata.quoteMetaData.imgMetaData;
    if (mimeType === 'image/jpeg') {
      const buffer = await downloadMediaMessage(
        { message: metadata.quoteMetaData.message } as any,
        'buffer',
        {}
      );
      const imageParts = this.createGenerativeContent(buffer, mimeType);
      const result = await this.generativeModel.generateContent([prompt, imageParts]);
      const resultText = result.response.text();

      return resultText;
    }

    return '';
  }

  async sendMessage({ sender, prompt, metadata }: AIArguments, handle: AIHandle) {
    try {
      let message = '';
      if (metadata.isQuoted) {
        if (metadata.quoteMetaData.type === 'image') {
          message = this.iconPrefix + (await this.generateImageCompletion(prompt, metadata));
        } else {
          prompt = 'Quoted Message:\n' + metadata.quoteMetaData.text + '---\nMessage:\n' + prompt;
          message = this.iconPrefix + (await this.generateCompletion(sender, prompt));
        }
      } else {
        message = this.iconPrefix + (await this.generateCompletion(sender, prompt));
      }

      handle({ text: message });
    } catch (err) {
      handle(
        '',
        '[Error] An error occur please see console for more information.\n[Error] Message:\n' + err
      );
    }
  }
}

export { GeminiModel };
