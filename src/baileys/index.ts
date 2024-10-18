/* Third-party modules */
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { useMongoDBAuthState } from 'mongo-baileys';
import { Boom } from '@hapi/boom';
import * as fs from 'fs';
import path from 'path';


/* Local modules */
import { messagesHandler } from './handlers/messages';
import { connectToMongoDB } from './database/mongo';
import { ENV } from './env';


/* Util */
const connectToDatabase = async () => {
  if (ENV.MONGO_ENABLED) {
    return await useMongoDBAuthState(
      ( await connectToMongoDB() ).collection as any
    );
  } else {
    return await useMultiFileAuthState('auth_info_baileys');
  }
}

const credentialsDirPath: string = path.join(process.cwd(), './auth_info_baileys');


/* Connect to WhatsApp */
export async function connectToWhatsApp() {
  // Determine the authentication state based on the environment configuration
  const { state, saveCreds } = await connectToDatabase();

  // Create a new WhatsApp socket connection
  const sock = makeWASocket({ printQRInTerminal: true, auth: state });

  // Handle connection updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    try {
      if (connection === 'close' && lastDisconnect) {
        const shouldReconnect =
          (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          connectToWhatsApp();
        } else {
          if (lastDisconnect.error) {
            fs.rmSync(credentialsDirPath, { force: true, recursive: true });
            connectToWhatsApp();
          }
        }
      } else if (connection === 'open') {
        // Connection is open
      }
    } catch (err) {
      console.error('Error handling connection update:', err);
    }
  });

  // Handle credential updates
  sock.ev.on('creds.update', saveCreds);

  // Handle incoming messages
  sock.ev.on('messages.upsert', (args) => {
    messagesHandler({ client: sock, ...args });
  });
}
