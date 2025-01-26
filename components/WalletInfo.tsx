import { useState, useEffect } from "react"
import { useSolanaAgentKit } from "@/hooks/use-solana-agent-kit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyableText } from "@/components/ui/copyable-text"
import { TOKENS } from "@/lib/constants"

export function WalletInfo() {
  const agent = useSolanaAgentKit()
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    if (agent) {
      agent.getBalance().then(setBalance)
    }
  }, [agent])

  if (!agent) {
    return <div>Loading Solana agent...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Wallet Address</h3>
            <CopyableText text={agent.wallet_address.toString()} showSolscan />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Balance</h3>
            <p className="text-lg font-semibold">{balance !== null ? `${balance} SOL` : "Loading..."}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Common Token Addresses</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">USDC:</span> <CopyableText text={TOKENS.USDC.toString()} showSolscan />
              </li>
              <li>
                <span className="font-medium">SOL:</span> <CopyableText text={TOKENS.SOL.toString()} showSolscan />
              </li>
              <li>
                <span className="font-medium">BARK:</span> <CopyableText text={TOKENS.BARK.toString()} showSolscan />
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

