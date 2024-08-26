import { AiModels } from '../types/AiModels';

type ModelType = 'Text' | 'Image';

/// base class for all AI models
abstract class AiModel<Arguments, CallBack> {
  public constructor(apiKey: string | undefined, aiModelName: AiModels, modelType?: ModelType) {
    this.apiKey = apiKey || 'undefined';
    this.aiModelName = aiModelName;
    this.modelType = modelType || 'Text';
  }

  abstract sendMessage(args: Arguments, handle: CallBack): Promise<any>;

  public apiKey: string;
  public aiModelName: AiModels;
  public modelType: ModelType;
}

export { AiModel };
