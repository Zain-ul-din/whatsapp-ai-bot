import makeWASocket, { MessageUpsertType, WAMessage } from '@whiskeysockets/baileys';
import useMessageParser from '../hooks/useMessageParser';
import { handleMessage, handlerMessageFromMe } from './message';

export function messagesHandler({
  client,
  messages,
  type
}: {
  client: ReturnType<typeof makeWASocket>;
  messages: WAMessage[];
  type: MessageUpsertType;
}) {
  Promise.all(
    messages.map(async (msg) => {
      try {
        if (type !== 'notify') return;

        const metadata = await useMessageParser(client, msg, type);

        if (!metadata) return;
        if (metadata.msgType === 'unknown') return;
        // prevent message from locked group
        if (metadata.isGroup && metadata.groupMetaData.groupIsLocked) return;

        await (metadata.fromMe
          ? handlerMessageFromMe({ client, msg, metadata, type })
          : handleMessage({ client, msg, metadata, type }));
      } catch (_) {}
    })
  );
}
