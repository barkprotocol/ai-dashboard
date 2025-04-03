"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { WalletData } from "@/types/wallet"
import { MOCK_WALLET_DATA } from "@/lib/constants"
import { getEnvVar } from "@/lib/client/env-utils"
import { toast } from "@/components/ui/use-toast"

interface WalletContextType {
  walletData: WalletData
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  refreshWalletData: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletData, setWalletData] = useState<WalletData>(MOCK_WALLET_DATA)
  const treasuryAddress = getEnvVar("treasuryAddress", "BARKTreasuryAddressPlaceholder123456789")

  // Check for previously connected wallet in localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem("connected_wallet")
    if (savedWallet) {
      try {
        const parsedWallet = JSON.parse(savedWallet)
        setWalletData(parsedWallet)
      } catch (e) {
        console.error("Failed to parse saved wallet data:", e)
      }
    }
  }, [])

  const connectWallet = async () => {
    try {
      // In a real implementation, this would connect to a real wallet
      // and use the RPC URL from environment variables
      const connectedWallet = {
        address: "8xHy2R6GxCW6XS47xzEH4EADjnvcwJCRQBm82fMYiRQA",
        balance: 1.25,
        isConnected: true,
      }

      setWalletData(connectedWallet)

      // Save to localStorage
      localStorage.setItem("connected_wallet", JSON.stringify(connectedWallet))

      return Promise.resolve()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      return Promise.reject(error)
    }
  }

  const disconnectWallet = () => {
    setWalletData({
      address: null,
      balance: null,
      isConnected: false,
    })

    // Remove from localStorage
    localStorage.removeItem("connected_wallet")

    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected successfully.",
    })
  }

  const refreshWalletData = async () => {
    if (walletData.isConnected) {
      // Mock implementation - would fetch actual balance in production
      // using the RPC URL from environment variables
      setWalletData({
        ...walletData,
        balance: walletData.balance ? walletData.balance + 0.01 : 1.25,
      })
      return Promise.resolve()
    }
    return Promise.reject(new Error("Wallet not connected"))
  }

  return (
    <WalletContext.Provider value={{ walletData, connectWallet, disconnectWallet, refreshWalletData }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

