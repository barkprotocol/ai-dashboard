"use server"

import { PublicKey } from "@solana/web3.js"
import { z } from "zod"

import { supabase } from "@/lib/db"
import { type ActionResponse, actionClient } from "@/lib/safe-action"
import { generateEncryptedKeyPair } from "@/lib/solana/wallet-generator"
import type { EmbeddedWallet } from "@/types/db"

import { retrieveAgentKit } from "./ai"
import { verifyUser } from "./user"

export const createWallet = actionClient.action<ActionResponse<EmbeddedWallet>>(async () => {
  const authResult = await verifyUser()
  const userId = authResult?.data?.data?.id

  if (!userId) {
    return {
      success: false,
      error: "Authentication failed",
    }
  }

  try {
    const { publicKey, encryptedPrivateKey } = await generateEncryptedKeyPair()
    const { data: wallet, error } = await supabase
      .from("user_wallets")
      .insert({
        ownerId: userId,
        name: "New Wallet",
        publicKey,
        encryptedPrivateKey,
        active: false,
        chain: "SOLANA",
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: wallet,
    }
  } catch (error) {
    console.error("Error creating wallet:", error)
    return {
      success: false,
      error: "Failed to create wallet",
    }
  }
})

export const getWallet = actionClient
  .schema(z.object({ id: z.string() }))
  .action<ActionResponse<EmbeddedWallet>>(async ({ parsedInput: { id } }) => {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id

    if (!userId) {
      return {
        success: false,
        error: "Authentication failed",
      }
    }

    const { data: wallet, error } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("id", id)
      .eq("ownerId", userId)
      .single()

    if (error) {
      return {
        success: false,
        error: "Wallet not found",
      }
    }

    return {
      success: true,
      data: wallet,
    }
  })

export const deleteWallet = actionClient
  .schema(z.object({ id: z.string() }))
  .action<ActionResponse<boolean>>(async ({ parsedInput: { id } }) => {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id

    if (!userId) {
      return {
        success: false,
        error: "Authentication failed",
      }
    }

    try {
      const { error } = await supabase.from("user_wallets").delete().eq("id", id).eq("ownerId", userId)

      if (error) throw error

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      console.error("Error deleting wallet:", error)
      return {
        success: false,
        error: "Failed to delete wallet",
      }
    }
  })

export const setActiveWallet = actionClient
  .schema(z.object({ id: z.string() }))
  .action<ActionResponse<boolean>>(async ({ parsedInput: { id } }) => {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id

    if (!userId) {
      return {
        success: false,
        error: "Authentication failed",
      }
    }

    try {
      // Deactivate all wallets for this user
      const { error } = await supabase.from("user_wallets").update({ active: false }).eq("ownerId", userId)

      if (error) throw error

      // Activate the selected wallet
      const { error: activationError } = await supabase.from("user_wallets").update({ active: true }).eq("id", id)

      if (activationError) throw activationError

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      console.error("Error setting active wallet:", error)
      return {
        success: false,
        error: "Failed to set active wallet",
      }
    }
  })

export const listEmbeddedWallets = actionClient.action<ActionResponse<EmbeddedWallet[]>>(async () => {
  const authResult = await verifyUser()
  const userId = authResult?.data?.data?.id

  if (!userId) {
    return {
      success: false,
      error: "Authentication failed",
    }
  }

  const { data: wallets, error } = await supabase.from("user_wallets").select("*").eq("ownerId", userId)

  if (error) {
    return {
      success: false,
      error: "Failed to fetch wallets",
    }
  }

  return {
    success: true,
    data: wallets,
  }
})

export const getActiveWallet = actionClient.action<ActionResponse<EmbeddedWallet>>(async () => {
  const authResult = await verifyUser()
  const userId = authResult?.data?.data?.id

  if (!userId) {
    return { success: false, error: "Unauthorized" }
  }

  const { data: wallet, error } = await supabase
    .from("user_wallets")
    .select("*")
    .eq("ownerId", userId)
    .eq("active", true)
    .single()

  if (error || !wallet) {
    return { success: false, error: "Wallet not found" }
  }

  return {
    success: true,
    data: wallet,
  }
})

export const embeddedWalletSendSOL = actionClient
  .schema(
    z.object({
      walletId: z.string(),
      recipientAddress: z.string(),
      amount: z.number(),
    }),
  )
  .action<ActionResponse<string>>(async ({ parsedInput: { walletId, recipientAddress, amount } }) => {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id
    if (!userId) {
      return {
        success: false,
        error: "Authentication failed",
      }
    }
    const { data: wallet, error } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("id", walletId)
      .eq("ownerId", userId)
      .single()
    if (error || !wallet) {
      return {
        success: false,
        error: "Wallet not found",
      }
    }
    const agent = (await retrieveAgentKit({ walletId }))?.data?.data?.agent
    try {
      const signature = await agent?.transfer(new PublicKey(recipientAddress), amount)
      return {
        success: true,
        data: signature,
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to send SOL (error: " + error + ")",
      }
    }
  })

export type WalletActions = {
  createWallet: typeof createWallet
  getWallet: typeof getWallet
  deleteWallet: typeof deleteWallet
  setActiveWallet: typeof setActiveWallet
  listEmbeddedWallets: typeof listEmbeddedWallets
  getActiveWallet: typeof getActiveWallet
  embeddedWalletSendSOL: typeof embeddedWalletSendSOL
}

