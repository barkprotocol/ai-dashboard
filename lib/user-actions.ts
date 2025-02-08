"use client"

import type { ActionResponse } from "@/lib/safe-action"
import type { EmbeddedWallet, BarkUser } from "@/types/db"

const getOrCreateUser = async (userId: string): Promise<ActionResponse<BarkUser>> => {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  })

  if (!response.ok) {
    return { success: false, error: "Failed to get or create user" }
  }

  const data = await response.json()
  return data
}

export const verifyUser = async (): Promise<
  ActionResponse<{
    id: string
    degenMode: boolean
    publicKey?: string
    privyId: string
  }>
> => {
  const response = await fetch("/api/verify-user")
  if (!response.ok) {
    return { success: false, error: "Authentication failed" }
  }

  const data = await response.json()
  return data
}

export const getUserData = async (): Promise<ActionResponse<BarkUser>> => {
  const response = await fetch("/api/user-data")
  if (!response.ok) {
    return { success: false, error: "Failed to get user data" }
  }

  const data = await response.json()
  return data
}

export const syncEmbeddedWallets = async (): Promise<ActionResponse<{ wallets: EmbeddedWallet[] }>> => {
  const response = await fetch("/api/sync-wallets")
  if (!response.ok) {
    return { success: false, error: "Failed to sync embedded wallets" }
  }

  const data = await response.json()
  return data
}

export type UserUpdateData = {
  degenMode?: boolean
  referralCode?: string
}

export async function updateUser(data: UserUpdateData) {
  const response = await fetch("/api/update-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    return { success: false, error: "Failed to update user" }
  }

  const result = await response.json()
  return result
}

console.log("Client-side user management module loaded")
console.log(
  "Available actions:",
  Object.keys({ getOrCreateUser, verifyUser, getUserData, syncEmbeddedWallets, updateUser }),
)

