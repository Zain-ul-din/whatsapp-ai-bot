import config from '../whatsapp-ai.config';
import { existsSync, readFileSync } from 'fs';
import { AiModels } from '../types/AiModels';
import { IModelConfig, IModelType } from '../types/Config';


export class Util {
  public static getModelByPrefix(message: string): AiModels | undefined {
    for (let [modelName, model] of Object.entries(config.models)) {
      if (
        !(model as IModelConfig).enable &&
        (modelName as AiModels) != 'Custom' // ignore array
      )
        continue;

      if ((modelName as AiModels) == 'Custom') {
        return Util.getModelByCustomPrefix(message);
      } else if (
        model &&
        message.toLocaleLowerCase().startsWith((model as IModelConfig)?.prefix.toLocaleLowerCase())
      ) {
        return modelName as AiModels;
      }
    }

    return undefined;
  }

  private static getModelByCustomPrefix(message: string): AiModels | undefined {
    if (!config.models.Custom) return undefined;
    for (let model of config.models.Custom) {
      if (!(model as IModelType).enable) continue;

      if (message.toLocaleLowerCase().startsWith(model.prefix.toLocaleLowerCase())) {
        return model.modelName as AiModels;
      }
    }

    return undefined;
  }

  public static readFile(filePath: string) {
    if (!existsSync(filePath)) throw new Error(`File at path ${filePath} not found`);

    return readFileSync(filePath, 'utf-8');
  }
}