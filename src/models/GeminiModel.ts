import { Message } from "whatsapp-web.js";
import { AiModel } from "./AiModel";
import { ENV } from "../lib/env";

class GeminiModel extends AiModel<string> {
    public constructor() {
        super(ENV.geminiKey, 'Gemini');
    }

    async sendMessage(prompt: string, msg: Message): Promise<any> {
        msg.reply('Gemini is coming soon!');
    }
}
