/**
 * Code for learning @whiskeysockets/baileys library
 */

import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as fs from 'fs';

const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

async function connectToWhatsApp() {
  const sock = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    try {
      if (connection === 'close' && lastDisconnect) {
        const shouldReconnect =
          (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

        console.log(
          'connection closed due to ',
          lastDisconnect.error,
          ', reconnecting ',
          shouldReconnect
        );
        // reconnect if not logged out
        if (shouldReconnect) {
          connectToWhatsApp();
        } else {
          // clear credentials
          if (lastDisconnect.error)
            fs.rmSync('./auth_info_baileys', { force: true, recursive: true });
        }
      } else if (connection === 'open') {
        console.log('opened connection');
      }
    } catch (err) {
      console.log(err);
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    console.log(JSON.stringify(m, undefined, 2));

    console.log('replying to', m.messages[0].key.remoteJid);
    // don't reply to self
    if (m.messages[0].key.fromMe) {
      console.log('returning this message is from me');
      return;
    }
    await sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' });
  });

  sock.ev.on('creds.update', saveCreds);
}

// run in main file
connectToWhatsApp();
