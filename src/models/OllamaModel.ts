/* Third-party modules */
import ollama from 'ollama';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

/* Local modules */
import { AIModel, AIArguments, AIHandle, AIMetaData } from './BaseAiModel';
import { ENV } from '../baileys/env';

/* Ollama Model */
class OllamaModel extends AIModel<AIArguments, AIHandle> {
  public instructions: string | undefined;

  public constructor() {
    super(undefined, 'Ollama', undefined);
  }

  public async generateCompletion(user: string, prompt: string): Promise<string> {
    if (!this.sessionExists(user)) this.sessionCreate(user);

    this.history[user].push(prompt);
    const response = await ollama.chat({
      model: '',
      messages: [...this.history[user]]
    });

    const responseText = response.message.content;
    this.history[user].push(responseText);

    return responseText;
  }

  async sendMessage({ sender, prompt, metadata }: AIArguments, handle: AIHandle) {
    try {
      let message = '';

      if (metadata.isQuoted) {
        prompt = 'Quoted Message:\n' + metadata.quoteMetaData.text + '\n---\nMessage:\n' + prompt;
        message = this.iconPrefix + (await this.generateCompletion(sender, prompt));
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

export { OllamaModel };
