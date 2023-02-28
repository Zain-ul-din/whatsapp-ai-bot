import { AiModels, AiModelsName } from './AiModels';

export interface IModelConfig {
    prefix: string;
    enable?: boolean | true;
}

export interface IModelType extends IModelConfig {
    modelName: string;
    prefix: string;
    context: string;
}

export interface IDefaultConfig {
    enable?: boolean | true;
    /** default model to use when prefix is disabled*/
    defaultModel: AiModelsName;
}

export type Config = {
    models: {
        [key in AiModels]?: key extends 'Custom' ? Array<IModelType> | [] : IModelConfig | null;
    };
} & {
    enablePrefix: IDefaultConfig;
};
