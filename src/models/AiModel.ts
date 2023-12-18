import { Message } from 'whatsapp-web.js';
import { AiModels } from '../types/AiModels';

type ModelType = 'Text' | 'Image'

/// base class for all AI models
abstract class AiModel<Arguments> {
    public constructor(
        apiKey: string | undefined, 
        aiModelName: AiModels,
        modelType?: ModelType
    ) {
        this.apiKey = apiKey || 'undefined';
        this.aiModelName = aiModelName;
        this.modelType = modelType || 'Text'
    }
    
    abstract sendMessage(args: Arguments, message: Message): Promise<any>;

    public apiKey: string;
    public aiModelName: AiModels;
    public modelType: ModelType
}

export { AiModel };
