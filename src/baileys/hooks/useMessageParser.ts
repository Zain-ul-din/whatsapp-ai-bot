import makeWASocket, { MessageUpsertType, WAMessage } from '@whiskeysockets/baileys';

export default async function useMessageParser(
  client: ReturnType<typeof makeWASocket>,
  message: WAMessage,
  type: MessageUpsertType
) {
  const { fromMe, remoteJid } = message.key;
  if (!remoteJid) return;

  // don't have message
  const msg = message.message;
  if (!msg) return;

  const {
    extendedTextMessage,
    imageMessage,
    videoMessage,
    audioMessage,
    documentMessage,
    contactMessage,
    locationMessage,
    conversation
  } = msg;

  let msgType:
    | 'unknown'
    | 'text'
    | 'extendedText'
    | 'image'
    | 'video'
    | 'document'
    | 'contact'
    | 'location'
    | 'audio' = 'unknown';
  if (conversation) msgType = 'text';
  else if (extendedTextMessage) msgType = 'text';
  else if (imageMessage) msgType = 'image';
  else if (videoMessage) msgType = 'video';
  else if (audioMessage) msgType = 'audio';
  else if (documentMessage) msgType = 'document';
  else if (contactMessage) msgType = 'contact';
  else if (locationMessage) msgType = 'location';

  // Initialize metadata
  let metaData = {
    remoteJid,
    sender: fromMe ? 'me' : remoteJid,
    senderName: message.pushName,
    fromMe,
    msgType,
    message,
    type,
    isQuoted: false,
    quoteMetaData: {
      remoteJid: '',
      message: {},
      text: '',
      type: 'text',
      hasImage: false,
      imgMetaData: {
        url: '',
        mimeType: '',
        caption: ''
      }
    },
    timeStamp: message.messageTimestamp
      ? new Date((message.messageTimestamp as number) * 1000)
      : new Date(),
    text: extendedTextMessage?.text || conversation || '',
    isGroup: false,
    groupMetaData: {
      groupName: '',
      groupIsLocked: false
    },
    hasImage: false,
    imgMetaData: {
      url: '',
      mimeType: '',
      caption: ''
    },
    hasAudio: false,
    audioMetaData: {
      url: '',
      mimeType: ''
    }
  };

  // Handle image messages
  if (imageMessage) {
    metaData.hasImage = true;
    metaData.imgMetaData.url = imageMessage.url || '';
    metaData.imgMetaData.mimeType = imageMessage.mimetype || '';
    metaData.imgMetaData.caption = imageMessage.caption || '';
    metaData.text = imageMessage.caption || '';
  }

  // Handle audio messages
  if (audioMessage) {
    metaData.hasAudio = true;
    metaData.audioMetaData.url = audioMessage.url || '';
    metaData.audioMetaData.mimeType = audioMessage.mimetype || '';
  }

  // gather context info
  if (extendedTextMessage) {
    const { contextInfo } = extendedTextMessage;

    if (contextInfo && contextInfo.quotedMessage) {
      metaData.isQuoted = true;

      metaData.quoteMetaData.remoteJid = contextInfo.remoteJid || '';
      metaData.quoteMetaData.text = contextInfo.quotedMessage?.conversation || '';
      metaData.quoteMetaData.message = contextInfo.quotedMessage || {};

      if (contextInfo.quotedMessage.imageMessage) {
        metaData.quoteMetaData.hasImage = true;
        metaData.quoteMetaData.type = 'image';
        metaData.quoteMetaData.imgMetaData.url = contextInfo.quotedMessage.imageMessage.url || '';
        metaData.quoteMetaData.imgMetaData.mimeType =
          contextInfo.quotedMessage.imageMessage.mimetype || '';
        metaData.quoteMetaData.text = contextInfo.quotedMessage.imageMessage.caption || '';
      }
    }
  }

  // Check if the message is from a group
  if (remoteJid.endsWith('@g.us')) {
    metaData.isGroup = true;
    const groupMetadata = await client.groupMetadata(remoteJid);
    metaData.groupMetaData.groupName = groupMetadata.subject;
    metaData.groupMetaData.groupIsLocked = groupMetadata.restrict || false;
  }

  metaData.message = message;

  return metaData;
}
