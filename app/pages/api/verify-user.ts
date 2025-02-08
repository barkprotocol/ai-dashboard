import type { NextApiRequest, NextApiResponse } from "next"
import { PrivyClient } from "@privy-io/server-auth"
import { supabase } from "@/lib/supabase-client"

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
    const { data: user, error } = await supabase
      .from("users")
      .select("id, degen_mode, privy_id, wallets(public_key)")
      .eq("privy_id", claims.userId)
      .single()

    if (error || !user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        privyId: user.privy_id,
        publicKey: user.wallets?.[0]?.public_key,
        degenMode: user.degen_mode,
      },
    })
  } catch (error) {
    console.error("Error in /api/verify-user:", error)
    return res.status(401).json({ success: false, error: "Authentication failed" })
  }
}

