import type { NextApiRequest, NextApiResponse } from "next"
import { PrivyClient } from "@privy-io/server-auth"
import { supabase } from "@/lib/supabase-client"
import { customAlphabet } from "nanoid"
import { Connection, Keypair } from "@solana/web3.js"
import * as bs58 from "bs58"

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET

if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error("Missing required Privy environment variables")
}

const PRIVY_SERVER_CLIENT = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET)

const solanaConnection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }

  const { userId } = req.body

  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*, wallets(*)")
      .eq("privy_id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      return res.status(500).json({ success: false, error: "Error fetching user" })
    }

    if (existingUser) {
      return res.status(200).json({ success: true, data: existingUser })
    }

    const generateReferralCode = async (): Promise<string> => {
      const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 8)
      const MAX_ATTEMPTS = 10
      let attempts = 0

      while (attempts < MAX_ATTEMPTS) {
        const referralCode = nanoid()
        const { data: existingCode } = await supabase
          .from("users")
          .select("referral_code")
          .eq("referral_code", referralCode)
          .single()

        if (!existingCode) {
          return referralCode
        }

        attempts++
      }

      throw new Error("Unable to generate a unique referral code after 10 attempts")
    }

    const referralCode = await generateReferralCode()
    const newKeypair = Keypair.generate()
    const publicKey = newKeypair.publicKey.toBase58()
    const encryptedPrivateKey = bs58.encode(newKeypair.secretKey)

    const { data: createdUser, error: createError } = await supabase
      .from("users")
      .insert({
        privy_id: userId,
        referral_code: referralCode,
      })
      .select()
      .single()

    if (createError) {
      return res.status(500).json({ success: false, error: "Error creating user" })
    }

    const { data: initialWallet, error: walletError } = await supabase
      .from("wallets")
      .insert({
        owner_id: createdUser.id,
        name: "Default",
        public_key: publicKey,
        encrypted_private_key: encryptedPrivateKey,
      })
      .select()
      .single()

    if (walletError) {
      return res.status(500).json({ success: false, error: "Error creating wallet" })
    }

    return res.status(200).json({
      success: true,
      data: {
        ...createdUser,
        wallets: [initialWallet],
      },
    })
  } catch (error) {
    console.error("Error in /api/user:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

