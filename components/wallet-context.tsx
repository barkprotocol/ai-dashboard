"use client"

import { type FC, type ReactNode, createContext, useContext, useState } from "react"
import { Button } from "@/components/ui/button"

interface WalletContextType {
  connected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false)

  const connect = async () => {
    // Implement your wallet connection logic here
    setConnected(true)
  }

  const disconnect = () => {
    // Implement your wallet disconnection logic here
    setConnected(false)
  }

  return <WalletContext.Provider value={{ connected, connect, disconnect }}>{children}</WalletContext.Provider>
}

export const WalletButton: FC = () => {
  const { connected, connect, disconnect } = useWallet()

  return (
    <Button
      onClick={connected ? disconnect : connect}
      className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
    >
      {connected ? "Disconnect Wallet" : "Connect Wallet"}
    </Button>
  )
}

