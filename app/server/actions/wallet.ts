"use server"

import { PublicKey } from "@solana/web3.js"
import { z } from "zod"

import prisma from "@/lib/prisma"
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
    const wallet = await prisma.wallet.create({
      data: {
        ownerId: userId,
        name: "New Wallet",
        publicKey,
        encryptedPrivateKey,
        active: false,
        chain: "SOLANA",
      },
    })

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

    const wallet = await prisma.wallet.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    })

    if (!wallet) {
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
      await prisma.wallet.deleteMany({
        where: {
          id,
          ownerId: userId,
        },
      })

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
      await prisma.wallet.updateMany({
        where: { ownerId: userId },
        data: { active: false },
      })

      // Activate the selected wallet
      await prisma.wallet.update({
        where: { id },
        data: { active: true },
      })

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

  const wallets = await prisma.wallet.findMany({
    where: { ownerId: userId },
  })

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

  const wallet = await prisma.wallet.findFirst({
    where: {
      ownerId: userId,
      active: true,
    },
  })

  if (!wallet) {
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
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    })
    if (!wallet || wallet.ownerId !== userId) {
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

