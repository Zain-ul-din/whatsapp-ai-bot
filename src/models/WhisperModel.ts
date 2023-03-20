import type { Message } from 'whatsapp-web.js';
import { useSpinner } from '../hooks/useSpinner';
import { MessageTemplates } from '../util/MessageTemplates';


import fs from 'fs';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

class WhisperModel  {

    public constructor() {
        this.aiModelName = 'Whisper'; 
        this.whisperServer = `http://localhost:${process.env.PORT ?? "3000"}`
    }

    public async sendMessage(fileBuffer: string, msg: Message): Promise<void> {
        const spinner = useSpinner(
            MessageTemplates.requestStr(this.aiModelName, msg.from, 'prompt: audio')
        );
        
        spinner.start();
        
        try {
            msg.reply ("processing audio...");

            const startTime = Date.now();
            
            axios
            .post (this.whisperServer, { data: fileBuffer })
            .then (res => console.log (res.data));
            
            // spinner.succeed(
            //     MessageTemplates.reqSucceedStr(
            //         this.aiModelName,
            //         msg.from,
            //         aiRes.text,
            //         Date.now() - startTime
            //     )
            // );
        } catch (err) {
            spinner.fail(
                MessageTemplates.reqFailStr(
                    this.aiModelName,
                    'at ChatGptModel.ts sendMessage(prompt, msg)',
                    err
                )
            );
            msg.reply('An error occur please see console for more information.');
        }
    }

    private aiModelName: string;
    private whisperServer: string;
}

export { WhisperModel };
