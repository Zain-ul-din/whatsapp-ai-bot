import { AIModels } from './AiModels';

export interface IModelConfig {
  prefix: string | undefined;
  enable: boolean;
}

export type SupportedBaseModels = keyof Pick<
  {
    [key in AIModels]: string;
  },
  'ChatGPT' | 'Gemini'
>;

export interface IModelType extends IModelConfig {
  modelName: string;
  prefix: string;
  context: string;
  includeSender?: boolean;
  baseModel: SupportedBaseModels;
  dangerouslyAllowFewShotApproach?: boolean;
}

export interface IDefaultConfig {
  enabled: boolean;
  /** default model to use when prefix is disabled*/
  defaultModel: AIModels;
}

export type Config = {
  models: {
    [key in AIModels]?: key extends 'Custom' ? Array<IModelType> : IModelConfig;
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
