import { AiModel } from './AiModel';
import fetch from 'node-fetch';
import { useSpinner } from '../hooks/useSpinner';
import type { Message } from 'whatsapp-web.js';
import { MessageMedia } from 'whatsapp-web.js';
import { MessageTemplates } from '../util/MessageTemplates';
import { ENV } from '../lib/env';

class StabilityModel extends AiModel<string> {
    public constructor() {
      super(ENV.dreamStudioKey, 'StableDiffusion');
    }
    
    public async sendMessage(prompt: string, msg: Message): Promise<void> {
      const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, msg.from, prompt));
      spinner.start();
      
      try {
        const startTime = Date.now();
        const engineId = "stable-diffusion-v1-6";
        const apiHost = process.env.API_HOST || 'https://api.stability.ai';
        
        if (!this.apiKey) {
          throw new Error("Missing Stability API key.");
        }
  
        const response = await fetch(`${apiHost}/v1/generation/${engineId}/text-to-image`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            "text_prompts": [
              {
                "text": prompt
              }
            ],
            "cfg_scale": 7,
            "height": 512,
            "width": 512,
            "samples": 1,
            "steps": 30,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`API call failed with HTTP status ${response.status}`);
        }
  
        const data = await response.json();
        const images = data.artifacts || [];
  
        if (images.length === 0) {
          throw new Error("No images were generated.");
        }
  
        const imageBuffer = Buffer.from(images[0].base64, 'base64');
        const base64String = imageBuffer.toString('base64');
        const image = new MessageMedia('image/jpeg', base64String, 'image.jpg');
        
        msg.reply(image);
        spinner.succeed(MessageTemplates.reqSucceedStr(this.aiModelName, msg.from, '', Date.now() - startTime));
      } catch (err) {
        console.error(err);
        spinner.fail(MessageTemplates.reqFailStr(this.aiModelName, 'at StabilityModel.ts sendMessage(prompt, msg)', err));
        msg.reply('An error occurred. Please see console for more information.');
      }
    }
  }
  
  export { StabilityModel };
