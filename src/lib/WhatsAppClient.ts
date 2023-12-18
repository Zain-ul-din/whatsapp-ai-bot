// whatsapp client
import { Client, Message } from 'whatsapp-web.js';
import QRCode from 'qrcode-terminal';

// config file
import config from '../whatsapp-ai.config';

// base typess
import { AiModels } from '../types/AiModels';
import { AiModel } from '../models/AiModel';

// extends from base
import { ChatGptModel } from '../models/ChatGptModel';
import { StabilityModel } from '../models/StabilityModel';
import { DalleModel } from '../models/DalleModel';
import { CustomModel } from '../models/CustomModel';
import { GeminiModel } from '../models/GeminiModel';

// utilities
import { Util } from '../util/Util';

// hooks
import { useSpinner } from '../hooks/useSpinner';
import { IModelConfig } from '../types/Config';

class WhatsAppClient {
    public constructor() {
        this.client = new Client({
            puppeteer: {
                args: ['--no-sandbox']
            }
        });

        this.promptModels = new Map<AiModels, AiModel<string>>();

        // init models
        this.promptModels.set('ChatGPT', new ChatGptModel());
        this.promptModels.set('DALLE', new DalleModel());
        this.promptModels.set('StableDiffusion', new StabilityModel());
        this.promptModels.set('Gemini', new GeminiModel());
        
        this.customModel = new CustomModel();
    }

    public initializeClient() {
        this.subscribeEvents();
        this.client.initialize();
    }

    private subscribeEvents() {
        const spinner = useSpinner('Whats App Client | generating QR Code... \n');
        spinner.start();
        this.client
            .on('qr', (qr) => {
                WhatsAppClient.generateQrCode(qr);
                spinner.succeed(`QR has been generated! | Scan QR Code with you're mobile.`);
            })
            .on('auth_failure', (message) => spinner.fail(`Authentication fail ${message}`))
            .on('authenticated', () => spinner.succeed('User Authenticated!'))
            .on('loading_screen', () => spinner.start('loading chat... \n'))
            .on('ready', () => spinner.succeed('Client is ready | All set!'))
            // arrow function to prevent this binding
            .on('message', async (msg) => this.onMessage(msg))
            .on('message_create', async (msg) => this.onSelfMessage(msg));
    }

    private static generateQrCode(qr: string) {
        QRCode.generate(qr, { small: true });
    }

    private async onMessage(message: Message) {
        const msgStr = message.body;

        if (msgStr.length == 0 || message.hasMedia) return;
        
        const modelToUse = Util.getModelByPrefix(msgStr);

        // message without prefix
        if (modelToUse == undefined && !config.enablePrefix.enable) {
            this.sendMessage(msgStr, message, config.enablePrefix.defaultModel);
            return;
        }

        if (modelToUse == undefined) return; // no models added

        // message with prefix
        if (this.promptModels.get(modelToUse)) {
            const model: IModelConfig = config.models[modelToUse as AiModels] as IModelConfig;
            this.promptModels
                .get(modelToUse)
                ?.sendMessage(msgStr.replace(model.prefix, ''), message);
        } else {
            // use custom model
            this.customModel.sendMessage({ prompt: msgStr, modelName: modelToUse }, message);
        }
    }

    private async onSelfMessage(message: Message) {
        if (!message.fromMe) return;  
        if (message.hasQuotedMsg && !Util.getModelByPrefix (message.body)) return;
        this.onMessage(message);
    }

    public async sendMessage(msgStr: string, message: Message, modelName: string) {
        if (this.promptModels.get(modelName as AiModels)) {
            const model: IModelConfig = config.models[modelName as AiModels] as IModelConfig;
            this.promptModels
                .get(modelName as AiModels)
                ?.sendMessage(msgStr.replace(model.prefix, ''), message);
        } else {
            this.customModel.sendMessage({ prompt: msgStr, modelName }, message);
        }
    }
    
    private client;

    // models require prompt to generate output
    private promptModels: Map<AiModels, AiModel<string>>;
    private customModel: CustomModel;

    // Helper functions

}

export { WhatsAppClient };

// DOCS:
// https://wwebjs.dev/guide/#qr-code-generation
