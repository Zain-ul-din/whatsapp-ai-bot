import { ENV } from '../baileys/env';

type MessageType = 'fetch' | 'succeed' | 'failed';

interface MessageTemplate {
  model: string;
  from: string;
  prompt: string;
  type: MessageType;
  response?: string;
  timeTook?: number;
  errInfo?: string;
  err?: any;
}

export default function generateMessage(
  type: MessageType,
  template: MessageTemplate
): string | undefined {
  if (ENV.Debug === false) return;

  switch (type) {
    case 'fetch':
      return `${template.model}Model fetching | prompt:"${template.prompt}" from user:"${template.from}"\n`;
    case 'succeed':
      return `${template.model}Model succeed | reply has been sent to user:"${template.from}" response:${template.response} <Done in ${template.timeTook} ms>\n\n`;
    case 'failed':
      return `${template.model}Model request fail | An error occur, ${template.errInfo} err: ${template.err}\n`;
    default:
      throw new Error('Invalid message type');
  }
}
