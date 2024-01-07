import { WhatsAppClient } from './lib/WhatsAppClient';
import { startServer } from './server';

startServer(()=> {
  console.log('🤖 starting client...');
  const whatsappClient = new WhatsAppClient();
  whatsappClient.initializeClient();
});


