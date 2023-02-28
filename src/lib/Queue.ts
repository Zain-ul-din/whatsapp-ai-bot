import { Message } from 'whatsapp-web.js';

class Queue {
    public constructor() {
        this.list = [];
    }

    public Enqueue(msg: Message) {
        this.list.push(msg);
    }

    public Dequeue() {}

    private list: Array<Message>;
}

export { Queue };
