import { AuthenticationCreds } from '@whiskeysockets/baileys';
import { MongoClient } from 'mongodb';
import { ENV } from '../env';

interface AuthDocument extends Document {
  _id: string;
  creds?: AuthenticationCreds;
}

export async function connectToMongoDB() {
  const client = new MongoClient(ENV.MONGO_URL || '');
  await client.connect();
  const db = client.db('whatsappAIBot');
  const collection = db.collection<AuthDocument>('authState');
  return { client, collection };
}
