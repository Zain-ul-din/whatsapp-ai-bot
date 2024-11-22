/* Local modules */
import { AIModel, AIArguments, AIHandle } from './BaseAiModel';
import { ENV } from '../baileys/env';
import { GeminiModel } from './GeminiModel';
import { ChatGPTModel } from './OpenAIModel';
import { IModelType, SupportedBaseModels } from '../types/Config';
import { readFile } from 'fs/promises';

class CustomAIModel extends AIModel<AIArguments, AIHandle> {
  private geminiModel: GeminiModel;
  private chatGPTModel: ChatGPTModel;
  private selectedBaseModel: SupportedBaseModels;
  private self: IModelType;

  public constructor(model: IModelType) {
    const apiKeys: { [key in SupportedBaseModels]: string | undefined } = {
      ChatGPT: ENV.API_KEY_OPENAI,
      Gemini: ENV.API_KEY_GEMINI
    };
    super(apiKeys[model.baseModel], model.modelName as any);

    this.self = model;
    this.selectedBaseModel = model.baseModel;
    this.geminiModel = new GeminiModel();
    this.chatGPTModel = new ChatGPTModel();
  }

  private constructInstructAblePrompt({
    prompt,
    instructions
  }: {
    prompt: string;
    instructions: string;
  }) {
    if (!this.self.dangerouslyAllowFewShotApproach) return prompt;
    return `
<context>
  ${instructions}
</context>
note!
  only answer from the given context
prompt:
  ${prompt}
    `;
  }

  public async sendMessage({ prompt, ...rest }: AIArguments, handle: AIHandle) {
    try {
      const instructions = await CustomAIModel.readContext(this.self);
      const promptWithInstructions = this.constructInstructAblePrompt({
        prompt,
        instructions: instructions
      });

      switch (this.selectedBaseModel) {
        case 'ChatGPT':
          this.chatGPTModel.instructions = !this.self.dangerouslyAllowFewShotApproach
            ? instructions
            : undefined;
          await this.chatGPTModel.sendMessage({ prompt: promptWithInstructions, ...rest }, handle);
          break;
        case 'Gemini':
          this.geminiModel.instructions = !this.self.dangerouslyAllowFewShotApproach
            ? instructions
            : undefined;
          await this.geminiModel.sendMessage({ prompt: promptWithInstructions, ...rest }, handle);
          break;
      }
    } catch (err) {
      await handle('', err as string);
    }
  }

  // read the context
  private static async readContext(model: IModelType) {
    const supportedFiles = ['.txt', '.text', '.md'];
    const httpProtocols = [
      'https://',
      'http://',
      'ftp://',
      'ftps://',
      'sftp://',
      'ssh://',
      'git://',
      'svn://',
      'ws://',
      'wss://'
    ];

    if (httpProtocols.filter((protocol) => model.context.trim().startsWith(protocol)).length > 0) {
      const res = await fetch(model.context);
      return res.text();
    }

    if (supportedFiles.filter((fileExt) => model.context.trim().endsWith(fileExt)).length > 0) {
      return readFile(model.context, { encoding: 'utf-8' });
    }

    // plane text
    return model.context;
  }
}

export { CustomAIModel };
