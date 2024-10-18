import makeWASocket, { MessageUpsertType, WAMessage } from '@whiskeysockets/baileys';
import useMessageParser from './hooks/useMessageParser';

type MessageHandlerParams = {
  client: ReturnType<typeof makeWASocket>;
  msg: WAMessage;
  type: MessageUpsertType;
  metadata: Exclude<
    ReturnType<typeof useMessageParser> extends Promise<infer U> ? U : never,
    undefined
  >;
};

export default MessageHandlerParams;
