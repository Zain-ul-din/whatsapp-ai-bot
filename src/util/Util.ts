import { existsSync, readFileSync } from 'fs';
import { IModelConfig } from '../types/Config';
import { AIModels } from '../types/AiModels';
import config from '../whatsapp-ai.config';

export class Util {
  public static getModelByPrefix(message: string): AIModels | undefined {
    for (let [modelName, model] of Object.entries(config.models)) {
      const currentModel = model as IModelConfig;
      if (!currentModel.enable) continue;

      if (
        message.toLocaleLowerCase().startsWith((currentModel.prefix as string).toLocaleLowerCase())
      ) {
        return modelName as AIModels;
      }
    }

    return undefined;
  }

  public static readFile(filePath: string) {
    if (!existsSync(filePath)) throw new Error(`File at path ${filePath} not found`);

    return readFileSync(filePath, 'utf-8');
  }
}
