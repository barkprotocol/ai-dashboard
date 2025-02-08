"use client"

import useSWR from "swr"

import { syncEmbeddedWallets } from "@/server/actions/user"
import type { EmbeddedWallet } from "@/types/db"

export function useEmbeddedWallets() {
  return useSWR<EmbeddedWallet[]>("embeddedWallets", async () => {
    // Call the action once, get back both user + wallets
    const result = await syncEmbeddedWallets()
    if (!result?.data?.success) {
      throw new Error(result?.data?.error ?? "Failed to sync wallets")
    }
    // Return just the wallets array for convenience
    return result?.data?.data?.wallets
  })
}

export function useActiveWallet() {
  const { data: wallets, error } = useEmbeddedWallets()

  if (error) {
    console.error("Error fetching wallets:", error)
    return null
  }

  return wallets?.find((wallet) => wallet.active) ?? null
}

