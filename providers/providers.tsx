"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/providers/theme-provider"
import { WalletProvider } from "@/hooks/use-wallet"
import { AgentProvider } from "@/contexts/agent-context"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <WalletProvider>
        <AgentProvider>{children}</AgentProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}

