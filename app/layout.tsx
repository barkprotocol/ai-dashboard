import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@/components/Header"
import { WalletContextProvider } from "@/components/WalletContextProvider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BARK AI Agent Platform",
  description: "AI-powered insights and automated trading strategies for Solana.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("flex min-h-screen antialiased", inter.className)}>
        <WalletContextProvider>
          <SidebarProvider>
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-col md:flex-row w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">{children}</main>
                </div>
              </div>
            </TooltipProvider>
          </SidebarProvider>
        </WalletContextProvider>
      </body>
    </html>
  )
}

