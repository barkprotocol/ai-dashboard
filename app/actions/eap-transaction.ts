"use server"

import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { z } from "zod"

import prisma from "@/lib/prisma"
import { type ActionResponse, actionClient } from "@/lib/safe-action"
import { type TransferWithMemoParams, createConnection } from "@/lib/solana"

import { verifyUser } from "./user"

const RECEIVE_WALLET_ADDRESS = process.env.NEXT_PUBLIC_EAP_RECEIVE_WALLET_ADDRESS!
const EAP_PRICE = 1.0
const TRANSACTION_TYPE = "EAP_PURCHASE"

interface MemoData {
  type: "EAP_PURCHASE"
  user_id: string
}

const parseTransaction = async (txHash: string): Promise<TransferWithMemoParams | null> => {
  try {
    const connection = createConnection()
    const tx = await connection.getParsedTransaction(txHash, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    })

    if (!tx?.meta || !tx.transaction) {
      console.error(`Failed to get transaction: ${txHash}`)
      return null
    }

    const transferIx = tx.transaction.message.instructions.find(
      (ix) => "program" in ix && ix.program === "system" && "parsed" in ix && ix.parsed.type === "transfer",
    )

    const memoIx = tx.transaction.message.instructions.find((ix) => "program" in ix && ix.program === "spl-memo")

    if (!transferIx || !("parsed" in transferIx)) {
      console.error(`Failed to find transfer instruction in transaction: ${txHash}`)
      return null
    }

    const transfer = transferIx.parsed
    if (!transfer.info) {
      console.error(`Missing transfer info in transaction: ${txHash}`)
      return null
    }

    let memoData = ""
    if (memoIx && "parsed" in memoIx) {
      memoData = memoIx.parsed
    }

    return {
      to: transfer.info.destination,
      amount: Number(transfer.info.lamports) / LAMPORTS_PER_SOL,
      memo: memoData,
    }
  } catch (error) {
    console.error(`Failed to parse transaction ${txHash}:`, error)
    return null
  }
}

export const checkEAPTransaction = actionClient
  .schema(z.object({ txHash: z.string() }))
  .action(async ({ parsedInput: { txHash } }): Promise<ActionResponse<{ success: boolean }>> => {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id
    if (!userId) {
      return { success: false, error: "Unauthorized: User not authenticated" }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.earlyAccess) {
      return {
        success: false,
        error: "User is already in Early Access Program",
      }
    }

    try {
      const parsed = await parseTransaction(txHash)
      if (!parsed) {
        return { success: false, error: "Transaction not found or invalid" }
      }
      const { to, amount, memo: memoData } = parsed

      if (to !== RECEIVE_WALLET_ADDRESS) {
        return { success: false, error: "Invalid receive wallet address" }
      }

      let memo: MemoData
      try {
        memo = JSON.parse(memoData)
        if (memo.type !== TRANSACTION_TYPE || typeof memo.user_id !== "string") {
          throw new Error("Invalid memo data structure")
        }
      } catch (error) {
        console.error("Invalid memo data format:", memoData)
        return { success: false, error: "Invalid memo data format" }
      }

      if (memo.type !== TRANSACTION_TYPE) {
        return { success: false, error: "Invalid transaction type" }
      }

      if (memo.user_id !== userId) {
        return { success: false, error: "Mismatched user ID in transaction" }
      }

      if (amount !== EAP_PRICE) {
        return {
          success: false,
          error: `Invalid amount (expected: ${EAP_PRICE} SOL, received: ${amount} SOL)`,
        }
      }

      await prisma.user.update({
        where: { id: memo.user_id },
        data: { earlyAccess: true },
      })

      console.log(`User ${userId} successfully added to Early Access Program`)
      return { success: true, data: { success: true } }
    } catch (error) {
      console.error("Processing EAP transaction failed:", error)
      return { success: false, error: "Failed to process EAP transaction" }
    }
  })

