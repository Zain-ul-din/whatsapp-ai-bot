import { AIModels, AIModelsName } from './AiModels';

export interface IModelConfig {
  prefix: string | undefined;
  enable: boolean;
  modelToUse?: string;
  settings?: any;
}

export interface IModelType extends IModelConfig {
  modelName: string;
  prefix: string;
  context: string;
  modelToUse?: AIModelsName;
  includeSender?: boolean;
}

export interface IDefaultConfig {
  enabled: boolean;
  /** default model to use when prefix is disabled*/
  defaultModel: AIModels;
}

export type Config = {
  models: {
    [key in AIModels]?: key extends 'Custom' ? Array<IModelType> | [] : IModelConfig | null;
  };
} & {
  prefix: IDefaultConfig;
  sessionStorage: {
    enable: boolean;
    wwjsPath: string;
  };
  sendWelcomeMessage: boolean;
  selfMessage: {
    skipPrefix: boolean;
  };
};
