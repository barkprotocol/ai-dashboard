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
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }

  const token = req.cookies["privy-token"]
  if (!token) {
    return res.status(401).json({ success: false, error: "No privy token found" })
  }

  const { degenMode, referralCode } = req.body

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

    const updateData: { degen_mode?: boolean; referring_user_id?: string } = {}

    if (degenMode !== undefined) {
      updateData.degen_mode = degenMode
    }

    if (referralCode) {
      const { data: referringUser, error: referringUserError } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", referralCode)
        .single()

      if (referringUserError || !referringUser) {
        return res.status(400).json({ success: false, error: "Invalid referral code" })
      }

      if (referringUser.id === user.id) {
        return res.status(400).json({ success: false, error: "You cannot use your own referral code" })
      }

      updateData.referring_user_id = referringUser.id
    }

    const { error: updateError } = await supabase.from("users").update(updateData).eq("id", user.id)

    if (updateError) {
      return res.status(500).json({ success: false, error: "Failed to update user" })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error in /api/update-user:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

