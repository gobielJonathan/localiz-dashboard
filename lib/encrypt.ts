import crypto from 'crypto';

export default function encrypt(message: string) {
  if (!process.env.PUBLIC_KEY) {
    console.warn('Please set public key into env first');
    return;
  }

  return crypto
    .publicEncrypt(process.env.PUBLIC_KEY, Buffer.from(message))
    .toString('base64');
}
