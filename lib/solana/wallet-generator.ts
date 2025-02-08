"use server"

import bs58 from "bs58"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

/**
 * Generate encrypted keypair
 */
export async function generateEncryptedKeyPair(): Promise<{ publicKey: string; encryptedPrivateKey: string }> {
  const { publicKey, privateKey } = await generateExposedKeyPair()
  const encryptedPrivateKey = await WalletEncryption.encrypt(privateKey)
  return { publicKey, encryptedPrivateKey }
}

/**
 * Decrypt private key
 */
export async function decryptPrivateKey(encryptedPrivateKey: string): Promise<string> {
  return WalletEncryption.decrypt(encryptedPrivateKey)
}

/**
 * Generate exposed keypair
 */
async function generateExposedKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const keypair = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])

  const publicKeyBuffer = await crypto.subtle.exportKey("raw", keypair.publicKey)
  const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", keypair.privateKey)

  const privateKeyBytes = new Uint8Array(privateKeyBuffer.slice(-32))
  const publicKeyBytes = new Uint8Array(publicKeyBuffer)
  const solanaPrivateKey = new Uint8Array([...privateKeyBytes, ...publicKeyBytes])

  const publicKeyBase58 = bs58.encode(publicKeyBytes)
  const privateKeyBase58 = bs58.encode(solanaPrivateKey)

  return {
    publicKey: publicKeyBase58,
    privateKey: privateKeyBase58,
  }
}

/**
 * Wallet encryption tool class
 */
class WalletEncryption {
  private static readonly algorithm = "aes-256-cbc"
  private static readonly encryptionKey = Buffer.from(process.env.WALLET_ENCRYPTION_KEY || "", "utf-8").subarray(0, 32)
  private static readonly ivLength = 16

  static async encrypt(source: string): Promise<string> {
    if (!this.encryptionKey.length) {
      throw new Error("Encryption key is not set")
    }

    const iv = randomBytes(this.ivLength)
    const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv)
    const encrypted = Buffer.concat([cipher.update(source, "utf8"), cipher.final()])
    const result = Buffer.concat([iv, encrypted])
    return result.toString("base64")
  }

  static async decrypt(encrypted: string): Promise<string> {
    if (!this.encryptionKey.length) {
      throw new Error("Encryption key is not set")
    }

    if (!encrypted) {
      throw new Error("Missing encrypted private key")
    }

    const encryptedBuffer = Buffer.from(encrypted, "base64")
    const iv = encryptedBuffer.subarray(0, this.ivLength)
    const encryptedContent = encryptedBuffer.subarray(this.ivLength)

    const decipher = createDecipheriv(this.algorithm, this.encryptionKey, iv)
    const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()])

    return decrypted.toString("utf8")
  }
}

export { WalletEncryption }

