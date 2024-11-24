import makeWASocket, { MessageUpsertType, WAMessage } from '@whiskeysockets/baileys';
import useMessageParser from '../hooks/useMessageParser';
import { handleMessage } from './message';
import { ENV } from '../env';

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
        if (metadata.isGroup && metadata.groupMetaData.groupIsLocked) return;
        if (metadata.fromMe && ENV.IGNORE_SELF_MESSAGES) return;

        await handleMessage({ client, msg, metadata, type });
      } catch (_) {}
    })
  );
}
