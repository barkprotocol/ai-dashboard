import type { User as PrivyUser } from "@privy-io/react-auth"

export type { PrivyUser }

export interface Wallet {
  id: string
  ownerId: string
  name: string
  publicKey: string
  walletSource: string
  delegated: boolean
  active: boolean
  chain: string
}

export interface BarkUser {
  id: string
  privyId: string
  referralCode: string | null
  referringUserId: string | null
  degenMode: boolean
  wallets: Wallet[]
  privyUser: PrivyUser
}

export type EmbeddedWallet = Omit<Wallet, "encryptedPrivateKey">

