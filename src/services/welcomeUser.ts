import { Message } from 'whatsapp-web.js';
import { WhatsAppClient } from '../lib/WhatsAppClient';
import config from '../whatsapp-ai.config';

/**
 * ensure send one message per session
 */
var sended = false;

const welcomeMessage = `
✨ Thank you for checking out Whats App AI Bot.

--- *Repository link* ---

https://github.com/Zain-ul-din/whatsapp-ai-bot

--- *Report bug here* ---

https://github.com/Zain-ul-din/whatsapp-ai-bot/issues/new

--- *Our website link* ---

for feature request and deployment: https://wa-ai-seven.vercel.app/

`;

export default function welcomeUser(msg: Message, client: WhatsAppClient) {
    if (!config.sendWelcomeMessage) return;
    if (sended) return;
    sended = true;
    console.log(client);
    const sender = msg.from;
    client.self().sendMessage(sender, welcomeMessage);
}
