import config from '../whatsapp-ai.config';
import { existsSync, readFileSync } from 'fs';
import { AIModels } from '../types/AiModels';
import { IModelConfig, IModelType } from '../types/Config';

export class Util {
  public static getModelByPrefix(message: string):
    | {
        name: Exclude<AIModels, 'Custom'>;
        meta: IModelConfig;
      }
    | {
        name: 'Custom';
        customMeta: { name: string; meta: IModelType } | undefined;
      }
    | undefined {
    // models
    for (let [modelName, model] of Object.entries(config.models)) {
      if (
        !(model as IModelConfig).enable &&
        (modelName as AIModels) != 'Custom' // ignore array
      )
        continue;

      if ((modelName as AIModels) == 'Custom') {
        return {
          name: 'Custom',
          customMeta: Util.getModelByCustomPrefix(message)
        };
      } else if (
        model &&
        message
          .toLocaleLowerCase()
          .startsWith(((model as IModelConfig)?.prefix || '').toLocaleLowerCase())
      ) {
        return {
          name: modelName as Exclude<AIModels, 'Custom'>,
          meta: config.models[modelName as AIModels] as IModelConfig
        };
      }
    }

    return undefined;
  }

  private static getModelByCustomPrefix(
    message: string
  ): { name: string; meta: IModelType } | undefined {
    if (!config.models.Custom) return undefined;
    for (let model of config.models.Custom) {
      if (!(model as IModelType).enable) continue;

      if (message.toLocaleLowerCase().startsWith(model.prefix.toLocaleLowerCase())) {
        return {
          name: model.modelName,
          meta: config.models.Custom.find((m) => m.modelName === model.modelName) as IModelType
        };
      }
    }

    return undefined;
  }

  public static readFile(filePath: string) {
    if (!existsSync(filePath)) throw new Error(`File at path ${filePath} not found`);
    return readFileSync(filePath, 'utf-8');
  }
}
