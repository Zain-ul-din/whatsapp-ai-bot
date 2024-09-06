import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as fs from 'fs';
import path from 'path';
import { messagesHandler } from './handlers/messages';
import { useMongoDBAuthState } from 'mongo-baileys';
import { ENV } from '../env';
import { connectToMongoDB } from '../mongo-db';

export async function connectToWhatsApp() {
  const { state, saveCreds } =
    ENV.MONGO_URL !== undefined
      ? await useMongoDBAuthState((await connectToMongoDB()).collection as any)
      : await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({ printQRInTerminal: true, auth: state });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    try {
      if (connection === 'close' && lastDisconnect) {
        const shouldReconnect =
          (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          connectToWhatsApp();
        } else {
          const credentialsDirPath = path.join(process.cwd(), './auth_info_baileys');
          if (lastDisconnect.error) {
            fs.rmSync(credentialsDirPath, { force: true, recursive: true });
            connectToWhatsApp();
          }
        }
      } else if (connection == 'open') {
        // here we go
      }
    } catch (err) {}
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', (args) => {
    messagesHandler({ client: sock, ...args });
  });
}
