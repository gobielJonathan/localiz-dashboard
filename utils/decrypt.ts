import crypto from 'crypto'

export default function decrypt(encryptedMessage: string) {
  if(!process.env.PRIVATE_KEY) {
    console.warn("Please set private key into env first")
     return
  }
  
  return crypto.privateDecrypt(
    process.env.PRIVATE_KEY,
    Buffer.from(encryptedMessage, 'base64')
  ).toString();
}