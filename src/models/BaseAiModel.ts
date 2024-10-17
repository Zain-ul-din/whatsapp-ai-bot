import { MessageUpsertType } from '@whiskeysockets/baileys';
import { AiModels } from '../types/AiModels';

type MetaData = {
  remoteJid: string;
  sender: string;
  senderName?: string;
  fromMe: boolean;
  msgType: 'unknown' | 'text' | 'extendedText' | 'image' | 'video' | 'document' | 'contact' | 'location' | 'audio';
  type: MessageUpsertType;
  isQuoted: boolean;
  timeStamp: Date;
  text: string;
  isGroup: boolean;
  groupMetaData: {
    groupName: string;
    groupIsLocked: boolean;
  };
  imgMetaData: {
    url: string;
    mimeType: string;
    caption: string;
  };
  audioMetaData: {
    url: string;
    mimeType: string;
  };
};

interface AIArguments {
  sender: string;
  prompt: string;
  metadata: MetaData;
  prefix: string;
}

abstract class AiModel<AIArguments, CallBack> {
  /* Variables */
  private apiKey: string;
  public modelName: AiModels;

  /* Methods */
  public constructor(apiKey: string | undefined, aiModelName: AiModels) {
    this.apiKey = apiKey || 'undefined';
    this.modelName = aiModelName;
  }

  public getApiKey(): string { return this.apiKey; }

  abstract sendMessage(args: AIArguments, handle: CallBack): Promise<any>;
}

export { AiModel, AIArguments };
