/* Third-party modules */
import { AnyMessageContent, downloadMediaMessage } from '@whiskeysockets/baileys';

/* Local modules */
import MessageHandlerParams from './../aimodeltype';
import { AiModels } from './../../types/AiModels';
import { Util } from './../../util/Util';

/* Models */
import { ChatGPTModel } from './../../models/OpenAIModel';
import { GeminiModel } from './../../models/GeminiModel';
import { FluxModel } from './../../models/FluxModel';

/* Declare models */
const modelTable: Record<AiModels, any> = {
  "ChatGPT":  new ChatGPTModel(),
  "Gemini":   new GeminiModel(),
  "FLUX": new FluxModel(),
  Custom: undefined
};


// handles message
export async function handleMessage({ client, msg, metadata }: MessageHandlerParams) {
  const modelToUse = Util.getModelByPrefix(metadata.text) as AiModels;
  if (!modelToUse) return;

  const prompt: string = metadata.text.split(' ').slice(1).join(' ');

  // handle models
  const model = modelTable[modelToUse];
  if (!model) return;

  model.sendMessage({ sender: metadata.sender, prompt: prompt, metadata: metadata }, async (res: AnyMessageContent, err: any) => {
    if ( err ) {
      console.log(err);
      return;
    }

    client.sendMessage(metadata.remoteJid, res, { quoted: msg });
  });
}

// handles message from self
export async function handlerMessageFromMe({ metadata, client, msg, type }: MessageHandlerParams) {
  if (metadata.fromMe && metadata.isQuoted) return;
  if (metadata.isQuoted && Util.getModelByPrefix(metadata.text)) return;
  await handleMessage({ metadata, client, msg, type });
}
