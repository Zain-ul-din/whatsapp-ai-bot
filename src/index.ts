// import { WhatsAppClient } from './lib/WhatsAppClient';
// import welcomeUser from './services/welcomeUser';

// console.log('🤖 starting client...');
// const whatsappClient = new WhatsAppClient();
// whatsappClient.initializeClient();

// whatsappClient.messageEvent.on('self', welcomeUser);

import { connectToWhatsApp } from './baileys';
connectToWhatsApp();
