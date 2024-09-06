import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { ChatGptModel } from '../../../models/ChatGptModel';
import { GeminiModel } from '../../../models/GeminiModel';
import { GeminiVisionModel } from '../../../models/GeminiVisionModel';
import { AiModels } from '../../../types/AiModels';
import { Util } from '../../../util/Util';
import MessageHandlerParams from '../types';
import { DalleModel } from '../../../models/DalleModel';
import { FluxModel } from '../../../models/FluxModel';

const gptModel = new ChatGptModel();
const geminiModel = new GeminiModel();
const geminiVisionModel = new GeminiVisionModel();
const dalle2Model = new DalleModel('DALLE');
const dalle3Model = new DalleModel('DALLE3');
const fluxModel = new FluxModel();

// handles message
export async function handleMessage({ client, msg, metadata }: MessageHandlerParams) {
  const modelToUse = Util.getModelByPrefix(metadata.text) as AiModels;

  if (!modelToUse) return;

  const prompt = metadata.text.split(' ').slice(1).join(' ');

  if (modelToUse === 'ChatGPT' && metadata.msgType === 'text') {
    await gptModel.sendMessage({ sender: metadata.sender, prompt }, async (res, err) => {
      client.sendMessage(metadata.remoteJid, { text: err || res }, { quoted: msg });
    });
    return;
  }

  if (modelToUse === 'Gemini' && metadata.msgType === 'text') {
    await geminiModel.sendMessage({ sender: metadata.sender, prompt }, async (res, err) => {
      client.sendMessage(metadata.remoteJid, { text: err || res }, { quoted: msg });
    });
    return;
  }

  if (modelToUse === 'DALLE' && metadata.msgType === 'text') {
    await dalle2Model.sendMessage({ sender: metadata.sender, prompt }, async (res, err) => {
      if (!err) {
        await client.sendMessage(
          metadata.remoteJid,
          { image: { url: res.url }, caption: res.caption },
          { quoted: msg }
        );
      } else {
        await client.sendMessage(metadata.remoteJid, { text: err }, { quoted: msg });
      }
    });
    return;
  }

  if (modelToUse === 'DALLE3' && metadata.msgType === 'text') {
    await dalle3Model.sendMessage({ sender: metadata.sender, prompt }, async (res, err) => {
      if (!err) {
        await client.sendMessage(
          metadata.remoteJid,
          { image: { url: res.url }, caption: res.caption },
          { quoted: msg }
        );
      } else {
        await client.sendMessage(metadata.remoteJid, { text: err }, { quoted: msg });
      }
    });
    return;
  }

  if (modelToUse === 'FLUX' && metadata.msgType === 'text') {
    await fluxModel.sendMessage({ sender: metadata.sender, prompt }, async (res, err) => {
      if (!err) {
        client.sendMessage(metadata.remoteJid, { image: res }, { quoted: msg });
      } else {
        client.sendMessage(metadata.remoteJid, { text: err }, { quoted: msg });
      }
    });
    return;
  }

  // Generative Models
  if (
    modelToUse === 'GeminiVision' &&
    metadata.msgType === 'image' &&
    metadata.imgMetaData.caption
  ) {
    const { mimeType, url } = metadata.imgMetaData;
    if (mimeType === 'image/jpeg') {
      const buffer = await downloadMediaMessage(msg, 'buffer', {});
      await geminiVisionModel.sendMessage(
        { sender: metadata.sender, prompt: { prompt, buffer, mimeType } },
        async (res, err) => {
          client.sendMessage(metadata.remoteJid, { text: err || res }, { quoted: msg });
        }
      );
      return;
    }
  }

  client.sendMessage(metadata.remoteJid, { text: `Hi It's WAAI BOT here 🤖` }, { quoted: msg });
}

// handles message from self
export async function handlerMessageFromMe({ metadata, client, msg, type }: MessageHandlerParams) {
  if (metadata.fromMe && metadata.isQuoted) return;
  if (metadata.isQuoted && Util.getModelByPrefix(metadata.text)) return;
  await handleMessage({ metadata, client, msg, type });
}
