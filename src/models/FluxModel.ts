/* Local modules */
import { ENV } from '../baileys/env';
import { AIArguments, AIHandle, AIModel } from './BaseAiModel';

/* Flux Model */
class FluxModel extends AIModel<AIArguments, AIHandle> {
  public endPointAPI: string = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';
  private headers;

  constructor() {
    super(ENV.API_KEY_HF, 'FLUX');

    this.headers = {
      Authorization: `Bearer ${this.getApiKey()}`,
      'Content-Type': 'application/json'
    };
  }

  public async generateImage(prompt: string): Promise<any> {
    const response = await fetch(this.endPointAPI, {
      headers: this.headers,
      method: 'POST',
      body: JSON.stringify({
        inputs: prompt
      })
    });

    const buffer = await (await response.blob()).arrayBuffer();
    const base64Img = Buffer.from(buffer);

    return base64Img;
  }

  async sendMessage({ prompt }: AIArguments, handle: AIHandle): Promise<any> {
    try {
      const imageData = await this.generateImage(prompt);

      await handle({ image: imageData });
    } catch (err) {
      await handle('', 'An error occur please see console for more information.');
    }
  }
}

export { FluxModel };
