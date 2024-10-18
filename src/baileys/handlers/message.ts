/* Third-party modules */
import { AnyRegularMessageContent, downloadMediaMessage } from '@whiskeysockets/baileys';

/* Local modules */
import MessageHandlerParams from './../aimodeltype';
import { AIModels } from './../../types/AiModels';
import { Util } from './../../util/Util';

/* Models */
import { ChatGPTModel } from './../../models/OpenAIModel';
import { GeminiModel } from './../../models/GeminiModel';
import { FluxModel } from './../../models/FluxModel';
import { ENV } from '../env';

/* Declare models */
const modelTable: Record<AIModels, any> = {
  ChatGPT: ENV.OPENAI_ENABLED ? new ChatGPTModel() : null,
  Gemini: ENV.GEMINI_ENABLED ? new GeminiModel() : null,
  FLUX: new FluxModel()
};

// handles message
export async function handleMessage({ client, msg, metadata }: MessageHandlerParams) {
  const modelToUse = Util.getModelByPrefix(metadata.text) as AIModels;
  if (!modelToUse) {
    if (ENV.Debug) {
      console.log("[Debug] Model '" + (modelToUse as string) + "' not found");
    }

    return;
  }

  const model = modelTable[modelToUse];
  if (!model) return;

  const prompt: string = metadata.text.split(' ').slice(1).join(' ');
  const messageResponse = await client.sendMessage(
    metadata.remoteJid,
    { text: ENV.Processing },
    { quoted: msg }
  );

  model.sendMessage(
    { sender: metadata.sender, prompt: prompt, metadata: metadata },
    async (res: any, err: any) => {
      if (err) {
        client.sendMessage(metadata.remoteJid, {
          text: "Sorry, i can't handle your request right now.",
          edit: messageResponse?.key
        });
        console.error(err);
        return;
      }
      res.edit = messageResponse?.key;

      client.sendMessage(metadata.remoteJid, res);
    }
  );
}

// handles message from self
export async function handlerMessageFromMe({ metadata, client, msg, type }: MessageHandlerParams) {
  // if (metadata.fromMe && metadata.isQuoted) return;
  // if (metadata.isQuoted && Util.getModelByPrefix(metadata.text)) return;
  await handleMessage({ metadata, client, msg, type });
}
