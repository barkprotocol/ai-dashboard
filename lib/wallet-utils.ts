import type { PublicKey, Transaction } from "@solana/web3.js"
import type { WalletAdapter as BaseWalletAdapter } from "@solana/wallet-adapter-base"

// Extend the WalletAdapter type to include signTransaction and signAllTransactions
interface ExtendedWalletAdapter extends BaseWalletAdapter {
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
}

// Define a custom BaseWallet interface
interface BaseWallet {
  publicKey: PublicKey | null
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
}

export function isBaseWallet(wallet: any): wallet is BaseWallet {
  return wallet && "publicKey" in wallet && "signTransaction" in wallet && "signAllTransactions" in wallet
}

export function isWalletAdapter(wallet: any): wallet is ExtendedWalletAdapter {
  return isBaseWallet(wallet) && "connect" in wallet && "disconnect" in wallet && "sendTransaction" in wallet
}

export async function signTransaction(
  wallet: BaseWallet | ExtendedWalletAdapter,
  transaction: Transaction,
): Promise<Transaction> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected")
  }

  return wallet.signTransaction(transaction)
}

export async function signAllTransactions(
  wallet: BaseWallet | ExtendedWalletAdapter,
  transactions: Transaction[],
): Promise<Transaction[]> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected")
  }

  return wallet.signAllTransactions(transactions)
}

export function getPublicKey(wallet: BaseWallet | ExtendedWalletAdapter): PublicKey {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected")
  }

  return wallet.publicKey
}

