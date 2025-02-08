import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Trading Dashboard",
  description:
    "An intuitive interface for managing token trades, analyzing real-time price data, and gaining AI-powered insights",
  keywords: "AI, trading, dashboard, cryptocurrency, Solana, DeFi",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex h-full overflow-hidden`}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider>
              <div className="flex h-full w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto" role="main" aria-label="Main content">
                  {children}
                </main>
              </div>
              <Toaster position="bottom-right" theme="system" />
            </SidebarProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

