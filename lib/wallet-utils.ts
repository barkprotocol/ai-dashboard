import type { PublicKey, Transaction } from "@solana/web3.js"
import type { WalletAdapter } from "@solana/wallet-adapter-base"

// Define a custom BaseWallet interface
interface BaseWallet {
  publicKey: PublicKey | null
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
}

export function isBaseWallet(wallet: any): wallet is BaseWallet {
  return wallet && "publicKey" in wallet && "signTransaction" in wallet && "signAllTransactions" in wallet
}

export function isWalletAdapter(wallet: any): wallet is WalletAdapter {
  return isBaseWallet(wallet) && "connect" in wallet && "disconnect" in wallet && "sendTransaction" in wallet
}

export async function signTransaction(
  wallet: BaseWallet | WalletAdapter,
  transaction: Transaction,
): Promise<Transaction> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected")
  }

  return wallet.signTransaction(transaction)
}

export async function signAllTransactions(
  wallet: BaseWallet | WalletAdapter,
  transactions: Transaction[],
): Promise<Transaction[]> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected")
  }

  return wallet.signAllTransactions(transactions)
}

export function getPublicKey(wallet: BaseWallet | WalletAdapter): PublicKey {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected")
  }

  return wallet.publicKey
}

v