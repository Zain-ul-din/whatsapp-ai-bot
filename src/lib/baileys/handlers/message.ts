import { ChatGptModel } from '../../../models/ChatGptModel';
import { GeminiModel } from '../../../models/GeminiModel';
import { AiModels } from '../../../types/AiModels';
import { Util } from '../../../util/Util';
import MessageHandlerParams from '../types';

const gptModel = new ChatGptModel();
const geminiModel = new GeminiModel();

// handles message
export async function handleMessage({ client, msg, metadata }: MessageHandlerParams) {
  const modelToUse = Util.getModelByPrefix(metadata.text) as AiModels;

  if (!modelToUse) return;

  const prompt = metadata.text.split(' ').slice(1).join(' ');

  if (modelToUse === 'ChatGPT' && metadata.msgType === 'text') {
    gptModel.sendMessage({ sender: metadata.sender, prompt }, async (res, err) => {
      client.sendMessage(metadata.remoteJid, { text: err || res }, { quoted: msg });
    });
    return;
  }

  if (modelToUse === 'Gemini' && metadata.msgType === 'text') {
    geminiModel.sendMessage({ sender: metadata.sender, prompt }, async (res, err) => {
      client.sendMessage(metadata.remoteJid, { text: err || res }, { quoted: msg });
    });
    return;
  }

  console.log('model to use: ', modelToUse);

  // Generative Models
  if (
    modelToUse === 'GeminiVision' &&
    metadata.msgType === 'image' &&
    metadata.imgMetaData.caption
  ) {
    console.log('Using Gemini Model with prompt', metadata.imgMetaData.caption);
    console.log('url: ', metadata.imgMetaData.url);
  }

  client.sendMessage(metadata.remoteJid, { text: `Hi It's WAAI BOT here 🤖` }, { quoted: msg });
}

// handles message from self
export async function handlerMessageFromMe({ metadata, client, msg, type }: MessageHandlerParams) {
  if (metadata.fromMe && metadata.isQuoted) return;
  if (metadata.isQuoted && Util.getModelByPrefix(metadata.text)) return;
  await handleMessage({ metadata, client, msg, type });
}
