import { useMemo, useState } from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { debugLog } from "@/lib/debug"
import type { AppConfig } from "@privy-io/react-auth"

type PrivyConfig = {
  appId: string
  config: AppConfig
}

const AuthProviders = ({ children, resolvedTheme }: { children: any; resolvedTheme: string }) => {
  const [error, setError] = useState<string | null>(null)

  const privyConfig = useMemo((): PrivyConfig | null => {
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

    if (!privyAppId) {
      console.error("Missing Privy configuration: NEXT_PUBLIC_PRIVY_APP_ID is not set")
      setError("Missing Privy app ID. Please check your environment variables.")
      return null
    }

    return {
      appId: privyAppId,
      config: {
        appearance: {
          theme: resolvedTheme === "dark" ? "dark" : "light",
          logo: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp",
        },
        loginMethods: ["email", "wallet"],
        embeddedWallets: {
          createOnLogin: "all-users",
          noPromptOnSignature: false,
        },
        supportedChains: [{ id: 1399811149, name: "Solana" }],
      },
    }
  }, [resolvedTheme])

  if (!privyConfig) {
    return <div>{error}</div>
  }

  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig.config}
      onError={(error) => {
        console.error("Privy initialization error:", error)
        debugLog("Privy initialization error", error, { module: "AuthProviders", level: "error" })
        setError("An error occurred during Privy authentication. Please try again later.")
      }}
    >
      {children}
    </PrivyProvider>
  )
}

export default AuthProviders

