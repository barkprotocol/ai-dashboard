"use server"

import { PublicKey } from "@solana/web3.js"
import { z } from "zod"

import { type ActionResponse, actionClient } from "@/lib/safe-action"
import type { EmbeddedWallet } from "@/types/db"

import { retrieveAgentKit } from "./ai"
import { verifyUser } from "./user"

// Mock data
const mockWallets: EmbeddedWallet[] = [
  {
    id: "1",
    ownerId: "1",
    publicKey: "mock_public_key",
    encryptedPrivateKey: "mock_encrypted_private_key",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const listEmbeddedWallets = actionClient.action<ActionResponse<EmbeddedWallet[]>>(async () => {
  const authResult = await verifyUser()
  const userId = authResult?.data?.data?.id

  if (!userId) {
    return {
      success: false,
      error: "Authentication failed",
    }
  }

  try {
    return {
      success: true,
      data: mockWallets.filter((wallet) => wallet.ownerId === userId),
    }
  } catch (error) {
    console.error("[DB Error] Failed to list embedded wallets:", error)
    return {
      success: false,
      error: "Failed to retrieve wallets",
    }
  }
})

export const getActiveWallet = actionClient.action<ActionResponse<EmbeddedWallet>>(async () => {
  const authResult = await verifyUser()
  const userId = authResult?.data?.data?.id

  if (!userId) {
    return { success: false, error: "Unauthorized" }
  }

  const wallet = mockWallets.find((w) => w.ownerId === userId && w.active === true)

  if (!wallet) {
    return { success: false, error: "Wallet not found" }
  }

  return {
    success: true,
    data: wallet,
  }
})

export const setActiveWallet = actionClient
  .schema(z.object({ publicKey: z.string() }))
  .action(async ({ parsedInput: { publicKey } }) => {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const walletIndex = mockWallets.findIndex((w) => w.ownerId === userId && w.publicKey === publicKey)

    if (walletIndex === -1) {
      return { success: false, error: "Wallet not found" }
    }

    // Deactivate all wallets for this user
    mockWallets.forEach((w) => {
      if (w.ownerId === userId) {
        w.active = false
      }
    })

    // Activate the selected wallet
    mockWallets[walletIndex].active = true

    return {
      success: true,
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
    const wallet = mockWallets.find((w) => w.id === walletId && w.ownerId === userId)
    if (!wallet) {
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
        data: signature || "mock_signature",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to send SOL (error: " + error + ")",
      }
    }
  })

