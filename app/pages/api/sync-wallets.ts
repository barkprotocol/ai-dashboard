import type { NextApiRequest, NextApiResponse } from "next"
import { PrivyClient } from "@privy-io/server-auth"
import { supabase } from "@/lib/supabase-client"
import type { WalletWithMetadata } from "@privy-io/types"

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET

if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error("Missing required Privy environment variables")
}

const PRIVY_SERVER_CLIENT = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }

  const token = req.cookies["privy-token"]
  if (!token) {
    return res.status(401).json({ success: false, error: "No privy token found" })
  }

  try {
    const claims = await PRIVY_SERVER_CLIENT.verifyAuthToken(token)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, privy_id")
      .eq("privy_id", claims.userId)
      .single()

    if (userError || !user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    const privyUser = await PRIVY_SERVER_CLIENT.getUser(user.privy_id)

    const embeddedWallets = privyUser.linkedAccounts.filter(
      (acct): acct is WalletWithMetadata => acct.type === "wallet" && acct.walletClientType === "privy",
    )

    for (const w of embeddedWallets) {
      const pubkey = w.address
      if (!pubkey) continue

      const { error } = await supabase.from("wallets").upsert({
        owner_id: user.id,
        name: "Privy Embedded",
        public_key: pubkey,
        wallet_source: "PRIVY",
        chain: "SOLANA",
        delegated: w.delegated ?? false,
        active: false,
      })

      if (error) throw error
    }

    const { data: userWallets, error: walletsError } = await supabase
      .from("wallets")
      .select("id, public_key, wallet_source, delegated, name, owner_id, active, chain")
      .eq("owner_id", user.id)

    if (walletsError) {
      return res.status(500).json({ success: false, error: "Error retrieving updated user wallets" })
    }

    return res.status(200).json({ success: true, data: { wallets: userWallets } })
  } catch (error) {
    console.error("Error in /api/sync-wallets:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

