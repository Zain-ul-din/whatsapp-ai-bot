/* Third-party modules */
import FormData from 'form-data';
import axios from 'axios';

/* Local modules */
import { AIArguments, AIHandle, AIModel } from './BaseAiModel';
import { ENV } from '../baileys/env';

/* Stability Mode */
class StabilityModel extends AIModel<AIArguments, AIHandle> {
  public endPointGenerate: string = 'https://api.stability.ai/v2beta/stable-image/generate/';
  public headers;

  constructor() {
    super(ENV.API_KEY_STABILITY, 'Stability');

    this.endPointGenerate = this.endPointGenerate + ENV.STABILITY_MODEL;
    this.headers = {
      Authorization: `Bearer ${this.getApiKey()}`,
      Accept: 'image/*'
    };
  }

  public async generateImage(prompt: string): Promise<Buffer> {
    const payload = {
      prompt: prompt,
      output_format: 'jpeg'
    };

    const formData = new FormData();

    const response = await axios.postForm(
      this.endPointGenerate,
      axios.toFormData(payload, formData),
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: this.headers
      }
    );

    if (response.status === 200) {
      return Buffer.from(response.data);
    } else {
      throw new Error(response.data.errors[0]);
    }
  }

  async sendMessage({ prompt }: AIArguments, handle: AIHandle): Promise<any> {
    try {
      const imageData = await this.generateImage(prompt);

      await handle({ image: imageData });
    } catch (err) {
      await handle('', err as string);
    }
  }
}

export { StabilityModel };
