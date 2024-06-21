import EventEmitter from 'events';
import { Message } from 'whatsapp-web.js';
import { WhatsAppClient } from '../WhatsAppClient';

/**
 * There are two types of messages:
 * * self - messages sent by the user currently using the bot.
 * * incoming - messages received from other users to the bot user.
 */
type MessageType = 'self' | 'incoming';

export default class MessageEvent {
    public constructor() {
        this.onMessageEvents = new Map();
        this.onMessageEvents.set('self', new EventEmitter());
        this.onMessageEvents.set('incoming', new EventEmitter());
    }

    public emit(messageType: MessageType, message: Message, client: WhatsAppClient) {
        this.onMessageEvents.get(messageType)?.emit(messageType, message, client);
    }

    public on(messageType: MessageType, callBack: (msg: Message, client: WhatsAppClient) => void) {
        this.onMessageEvents.get(messageType)?.addListener(messageType, callBack);
    }

    private onMessageEvents: Map<MessageType, EventEmitter>;
}
