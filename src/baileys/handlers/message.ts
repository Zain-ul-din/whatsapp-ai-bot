/* Local modules */
import MessageHandlerParams from './../aimodeltype';
import { AIModels } from './../../types/AiModels';
import { Util } from './../../util/Util';

/* Models */
import { StabilityModel } from '../../models/StabilityModel';
import { ChatGPTModel } from './../../models/OpenAIModel';
import { GeminiModel } from './../../models/GeminiModel';
import { FluxModel } from './../../models/FluxModel';
import { ENV } from '../env';
import config from '../../whatsapp-ai.config';
import { CustomAIModel } from '../../models/CustomModel';
import { OllamaModel } from '../../models/OllamaModel';

/* Declare models */
const modelTable: Record<AIModels, any> = {
  ChatGPT: ENV.OPENAI_ENABLED ? new ChatGPTModel() : null,
  Gemini: ENV.GEMINI_ENABLED ? new GeminiModel() : null,
  FLUX: ENV.HF_ENABLED ? new FluxModel() : null,
  Stability: ENV.STABILITY_ENABLED ? new StabilityModel() : null,
  Dalle: null,
  Ollama: ENV.OLLAMA_ENABLED ? new OllamaModel() : null,
  Custom: config.models.Custom
    ? config.models.Custom.map((model) => new CustomAIModel(model))
    : null
};

if (ENV.DALLE_ENABLED && ENV.OPENAI_ENABLED) {
  modelTable.Dalle = modelTable.ChatGPT;
} else if (ENV.DALLE_ENABLED && !ENV.OPENAI_ENABLED) {
  modelTable.Dalle = new ChatGPTModel();
}

// handles message
export async function handleMessage({ client, msg, metadata }: MessageHandlerParams) {
  const modelInfo = Util.getModelByPrefix(metadata.text);

  if (!modelInfo) {
    if (ENV.Debug) {
      console.log("[Debug] Model '" + modelInfo + "' not found");
    }
    return;
  }

  let model = modelTable[modelInfo.name];
  let prefix = modelInfo.name !== 'Custom' ? modelInfo.meta.prefix : '';

  if (modelInfo.name === 'Custom') {
    if (!modelInfo.customMeta) return;
    const customModels = model as Array<CustomAIModel>;
    const potentialCustomModel = customModels.find(
      (model) => model.modelName === modelInfo.customMeta?.meta.modelName
    );

    model = potentialCustomModel;
    prefix = modelInfo.customMeta.meta.prefix;
  }

  if (!model) {
    if (ENV.Debug) {
      console.log(
        "[Debug] Model '" + JSON.stringify(modelInfo, null, 2) + "' is disabled or not found"
      );
    }
    return;
  }

  const prompt: string = metadata.text.split(' ').slice(1).join(' ');
  const messageResponse = await client.sendMessage(
    metadata.remoteJid,
    { text: ENV.Processing },
    { quoted: msg }
  );

  model.sendMessage(
    {
      sender: metadata.sender,
      prompt: prompt,
      metadata: metadata,
      prefix: prefix
    },
    async (res: any, err: any) => {
      if (err) {
        client.sendMessage(metadata.remoteJid, {
          text: "Sorry, i can't handle your request right now.",
          edit: messageResponse?.key
        });
        console.error(err);
        return;
      }

      if (res.image) {
        // delete the old message
        if (messageResponse?.key) {
          client.sendMessage(metadata.remoteJid, { delete: messageResponse.key });
        }
        client.sendMessage(metadata.remoteJid, res, { quoted: msg });
      } else {
        res.edit = messageResponse?.key;
        client.sendMessage(metadata.remoteJid, res);
      }
    }
  );
}
