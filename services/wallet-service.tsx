"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface WalletData {
  address: string | null
  balance: number | null
  isConnected: boolean
}

interface WalletContextType {
  walletData: WalletData
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  refreshWalletData: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletData, setWalletData] = useState<WalletData>({
    address: null,
    balance: null,
    isConnected: false,
  })

  const connectWallet = async () => {
    // Mock implementation - would use actual wallet adapter in production
    setWalletData({
      address: "8xHy2R6GxCW6XS47xzEH4EADjnvcwJCRQBm82fMYiRQA",
      balance: 1.25,
      isConnected: true,
    })
  }

  const disconnectWallet = () => {
    setWalletData({
      address: null,
      balance: null,
      isConnected: false,
    })
  }

  const refreshWalletData = async () => {
    if (walletData.isConnected) {
      // Mock implementation - would fetch actual balance in production
      setWalletData({
        ...walletData,
        balance: walletData.balance ? walletData.balance + 0.01 : 1.25,
      })
    }
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

