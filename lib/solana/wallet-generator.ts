"use server"

import bs58 from "bs58"

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
  private static readonly algorithm = "AES-GCM"
  private static readonly ivLength = 12

  static async encrypt(source: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength))
    const encodedSource = new TextEncoder().encode(source)

    const key = await this.getEncryptionKey()
    const encrypted = await crypto.subtle.encrypt({ name: this.algorithm, iv }, key, encodedSource)

    const encryptedArray = new Uint8Array(encrypted)
    const result = new Uint8Array(iv.length + encryptedArray.length)
    result.set(iv)
    result.set(encryptedArray, iv.length)

    return btoa(String.fromCharCode.apply(null, result as unknown as number[]))
  }

  static async decrypt(encrypted: string): Promise<string> {
    if (!encrypted) {
      throw new Error("Missing encrypted private key")
    }

    const encryptedBuffer = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
    const iv = encryptedBuffer.slice(0, this.ivLength)
    const encryptedContent = encryptedBuffer.slice(this.ivLength)

    const key = await this.getEncryptionKey()
    const decrypted = await crypto.subtle.decrypt({ name: this.algorithm, iv }, key, encryptedContent)

    return new TextDecoder().decode(decrypted)
  }

  private static async getEncryptionKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = encoder.encode(process.env.WALLET_ENCRYPTION_KEY || "")

    return crypto.subtle.importKey("raw", keyMaterial, { name: "PBKDF2" }, false, ["deriveKey"]).then((key) =>
      crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: encoder.encode("salt"),
          iterations: 100000,
          hash: "SHA-256",
        },
        key,
        { name: this.algorithm, length: 256 },
        false,
        ["encrypt", "decrypt"],
      ),
    )
  }
}

export { WalletEncryption }

