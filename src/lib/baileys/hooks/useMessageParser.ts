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
  else if (extendedTextMessage) msgType = 'extendedText';
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
    type,
    isQuoted: false,
    timeStamp: message.messageTimestamp
      ? new Date((message.messageTimestamp as number) * 1000)
      : new Date(),
    text: extendedTextMessage?.text || conversation || '',
    isGroup: false,
    groupMetaData: {
      groupName: '',
      groupIsLocked: false
    },
    imgMetaData: {
      url: '',
      mimeType: '',
      caption: ''
    },
    audioMetaData: {
      url: '',
      mimeType: ''
    }
  };

  // Handle image messages
  if (imageMessage) {
    metaData.msgType = 'image';
    if (imageMessage.url) metaData.imgMetaData.url = imageMessage.url;
    if (imageMessage.mimetype) metaData.imgMetaData.mimeType = imageMessage.mimetype;
    if (imageMessage.caption) {
      metaData.imgMetaData.caption = imageMessage.caption;
      metaData.text = imageMessage.caption;
    }
  }

  // Handle audio messages
  if (audioMessage) {
    metaData.msgType = 'audio';
    if (audioMessage.url) metaData.audioMetaData.url = audioMessage.url;
    if (audioMessage.mimetype) metaData.audioMetaData.mimeType = audioMessage.mimetype;
  }

  // gather context info
  if (extendedTextMessage) {
    const { contextInfo } = extendedTextMessage;
    if (contextInfo && contextInfo.quotedMessage) metaData.isQuoted = true;
  }

  // Check if the message is from a group
  if (remoteJid.endsWith('@g.us')) {
    metaData.isGroup = true;
    const groupMetadata = await client.groupMetadata(remoteJid);
    metaData.groupMetaData.groupName = groupMetadata.subject;
    metaData.groupMetaData.groupIsLocked = groupMetadata.restrict || false;
  }

  return metaData;
}
