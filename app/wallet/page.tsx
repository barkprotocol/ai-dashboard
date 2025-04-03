import { WalletDashboard } from "@/components/wallet/wallet-dashboard"
import { WalletProvider } from "@/providers/wallet-provider"

export default function WalletPage() {
  return (
    <WalletProvider>
      <WalletDashboard />
    </WalletProvider>
  )
}

