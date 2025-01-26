"use client"

import { type FC, useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Copy, Check, Wallet } from "lucide-react"

export const WalletButton: FC = () => {
  const { publicKey, disconnect, connecting, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    if (connected) {
      toast.success("Wallet connected successfully!")
    }
  }, [connected])

  const handleWalletClick = useCallback(() => {
    if (!connected) {
      setVisible(true)
    } else {
      disconnect().catch((error) => {
        console.error("Failed to disconnect:", error)
        toast.error("Failed to disconnect. Please try again.")
      })
    }
  }, [connected, disconnect, setVisible])

  const copyAddress = useCallback(async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toBase58())
        setCopying(true)
        toast.success("Address copied to clipboard!")
        setTimeout(() => setCopying(false), 1500)
      } catch (error) {
        console.error("Failed to copy address:", error)
        toast.error("Failed to copy address. Please try again.")
      }
    }
  }, [publicKey])

  const truncatedAddress = publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : ""

  return (
    <div className="flex justify-center items-center space-x-2">
      <Button
        onClick={handleWalletClick}
        variant="outline"
        className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        disabled={connecting}
        aria-label={connecting ? "Connecting wallet" : connected ? "Disconnect wallet" : "Connect wallet"}
      >
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Connecting...</span>
          </>
        ) : connected ? (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Disconnect</span>
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </>
        )}
      </Button>

      {connected && publicKey && (
        <Button
          onClick={copyAddress}
          variant="outline"
          className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          disabled={copying}
          aria-label={copying ? "Address copied" : `Copy wallet address: ${truncatedAddress}`}
        >
          {copying ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{truncatedAddress}</span>
            </>
          )}
        </Button>
      )}
    </div>
  )
}

