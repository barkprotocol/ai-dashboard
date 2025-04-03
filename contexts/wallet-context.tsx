"use client"

import type * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { WalletData } from "@/types/wallet"
import { fetchBalance } from "@/lib/solana/solana"
import { MOCK_WALLET_DATA } from "@/lib/constants"

// Define the context type
type WalletContextType = {
  wallet: WalletData
  isConnecting: boolean
  error: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  refreshBalance: () => Promise<void>
}

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Provider component
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletData>(MOCK_WALLET_DATA)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for previously connected wallet
  useEffect(() => {
    const checkSavedWallet = async () => {
      const savedWallet = localStorage.getItem("connected_wallet")
      if (savedWallet) {
        try {
          const parsedWallet = JSON.parse(savedWallet)
          setWallet(parsedWallet)
        } catch (e) {
          console.error("Failed to parse saved wallet data:", e)
          localStorage.removeItem("connected_wallet")
        }
      }
    }

    checkSavedWallet()
  }, [])

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // In a real implementation, you would use a wallet adapter
      // For now, we'll use mock data
      const connectedWallet = {
        address: "8xHy2R6GxCW6XS47xzEH4EADjnvcwJCRQBm82fMYiRQA",
        balance: 1.25,
        isConnected: true,
      }

      setWallet(connectedWallet)
      localStorage.setItem("connected_wallet", JSON.stringify(connectedWallet))
    } catch (error) {
      setError("Failed to connect wallet")
      console.error("Wallet connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet({
      address: null,
      balance: null,
      isConnected: false,
    })
    localStorage.removeItem("connected_wallet")
  }

  const refreshBalance = async () => {
    if (!wallet.address) return

    try {
      const balance = await fetchBalance(wallet.address)
      const updatedWallet = { ...wallet, balance }
      setWallet(updatedWallet)
      localStorage.setItem("connected_wallet", JSON.stringify(updatedWallet))
    } catch (error) {
      console.error("Error refreshing balance:", error)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

// Hook to use the wallet context
export function useWallet() {
  const context = useContext(WalletContext)

  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }

  return context
}

