import { Message } from "whatsapp-web.js";
import { AiModel } from "./AiModel";
import { ENV } from "../lib/env";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSpinner } from "../hooks/useSpinner";
import { MessageTemplates } from "../util/MessageTemplates";

class GeminiVisionModel extends AiModel<string> {
    
    public constructor() {
        super(ENV.geminiKey, 'GeminiVision', 'Image')
        this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
    
    async sendMessage(prompt: string, msg: Message): Promise<any> {
        const media = await msg.downloadMedia();
        
        if(!media || !media.mimetype.endsWith("image/jpeg")) return;
        
        const spinner = useSpinner(MessageTemplates.requestStr(this.aiModelName, msg.from, prompt));
        spinner.start();

        try {
            const startTime = Date.now();

            // check out more at: https://ai.google.dev/tutorials/node_quickstart
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision"});

            const imageParts = [
                this.toGenerativePart(Buffer.from(media.data, "base64"),media.mimetype)
            ]

            const result = await model.generateContent([prompt, ...imageParts])
            const resText = (await result.response).text()

            msg.reply(resText);
            
            spinner.succeed(
                MessageTemplates.reqSucceedStr(
                    this.aiModelName,
                    msg.from,
                    resText,
                    Date.now() - startTime
                )
            );
        } catch(err) {
            spinner.fail(
                MessageTemplates.reqFailStr(
                    this.aiModelName,
                    'at ChatGptModel.ts sendMessage(prompt, msg)',
                    err
                )
            );
            msg.reply('An error occur please see console for more information.');
        }
    }

    private toGenerativePart(buffer: Buffer, mimeType: string) {
        return {
            inlineData: {
              data: buffer.toString("base64"),
              mimeType
            },
        };
    }
    
    private genAI: GoogleGenerativeAI
}

export { GeminiVisionModel };
