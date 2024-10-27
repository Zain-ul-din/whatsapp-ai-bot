import { existsSync, readFileSync } from 'fs';
import { IModelConfig } from '../types/Config';
import { AIModels } from '../types/AiModels';
import config from '../whatsapp-ai.config';

export class Util {
  public static getModelByPrefix(
    message: string,
    fromMe: Boolean
  ): { modelName: AIModels; prefix: string } | undefined {
    if (fromMe) {
      const defaultModelName = config.prefix.defaultModel;
      const defaultModel = config.models[defaultModelName];
      if (defaultModel && defaultModel.enable) {
        return { modelName: defaultModelName as AIModels, prefix: defaultModel.prefix as string };
      }
    }

    for (let [modelName, model] of Object.entries(config.models)) {
      const currentModel = model as IModelConfig;
      if (!currentModel.enable) continue;

      if (
        message.toLocaleLowerCase().startsWith((currentModel.prefix as string).toLocaleLowerCase())
      ) {
        return { modelName: modelName as AIModels, prefix: currentModel.prefix as string };
      }
    }

    return undefined;
  }

  public static readFile(filePath: string) {
    if (!existsSync(filePath)) throw new Error(`File at path ${filePath} not found`);

    return readFileSync(filePath, 'utf-8');
  }
}
