import { Message } from 'whatsapp-web.js';
import { AiModels } from '../types/AiModels';

/// base class for all AI models
abstract class AiModel<Arguments> {
    public constructor(apiKey: string | undefined, aiModelName: AiModels) {
        this.apiKey = apiKey || 'undefined';
        this.aiModelName = aiModelName;
    }

    abstract sendMessage(args: Arguments, message: Message): Promise<any>;

    public apiKey: string;
    public aiModelName: AiModels;
}

export { AiModel };
