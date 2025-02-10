import { MessageUpsertType } from '@whiskeysockets/baileys';
import { AIModels } from '../types/AiModels';

type AIHandle = (res: any, error?: string) => Promise<void>;

type AIMetaData = {
  remoteJid: string;
  sender: string;
  senderName?: string;
  fromMe: boolean;
  message: any;
  msgType:
    | 'unknown'
    | 'text'
    | 'extendedText'
    | 'image'
    | 'video'
    | 'document'
    | 'contact'
    | 'location'
    | 'audio';
  type: MessageUpsertType;
  isQuoted: boolean;
  quoteMetaData: {
    remoteJid: string;
    message: any;
    text: string;
    type: 'text' | 'image';
    hasImage: boolean;
    imgMetaData: {
      url: string;
      mimeType: string;
      caption: string;
    };
  };
  timeStamp: Date;
  text: string;
  isGroup: boolean;
  groupMetaData: {
    groupName: string;
    groupIsLocked: boolean;
  };
  hasImage: boolean;
  imgMetaData: {
    url: string;
    mimeType: string;
    caption: string;
  };
  hasAudio: boolean;
  audioMetaData: {
    url: string;
    mimeType: string;
  };
};

interface AIArguments {
  sender: string;
  prompt: string;
  metadata: AIMetaData;
  prefix: string;
}

abstract class AIModel<AIArguments, CallBack> {
  /* Variables */
  private apiKey: string;
  public history: { [from: string]: any[] };
  public modelName: AIModels;
  public iconPrefix: string;

  /* Methods */
  public constructor(apiKey: string | undefined, modelName: AIModels, icon?: string) {
    this.apiKey = apiKey || 'undefined';
    this.modelName = modelName;

    this.history = {};
    this.iconPrefix = icon === undefined ? '' : '[' + icon + '] ';
  }

  public getApiKey(): string {
    return this.apiKey;
  }
  public sessionCreate(user: string): void {
    this.history[user] = [];
  }

  public sessionRemove(user: string): void {
    delete this.history[user];
  }

  public sessionExists(user: string): boolean {
    return this.history[user] !== undefined;
  }

  public sessionAddMessage(user: string, args: any): void {
    this.history[user].push(args);
  }

  public addPrefixIcon(text: string): string {
    return this.iconPrefix + text;
  }

  abstract sendMessage(args: AIArguments, handle: CallBack): Promise<any>;
}

export { AIModel, AIArguments, AIHandle, AIMetaData };
