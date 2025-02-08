"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { PrivyClient } from "@privy-io/server-auth"
import type { WalletWithMetadata } from "@privy-io/server-auth"
import { customAlphabet } from "nanoid"
import { z } from "zod"

import { supabase } from "@/lib/db"
import { type ActionResponse, actionClient } from "@/lib/safe-action"
import { generateEncryptedKeyPair } from "@/lib/solana/wallet-generator"
import type { EmbeddedWallet, PrismaUser } from "@/types/db"

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET
const PRIVY_SIGNING_KEY = process.env.PRIVY_SIGNING_KEY

if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error("Missing required Privy environment variables")
}

const PRIVY_SERVER_CLIENT = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET, {
  ...(!!PRIVY_SIGNING_KEY && {
    walletApi: {
      authorizationPrivateKey: PRIVY_SIGNING_KEY,
    },
  }),
})

const getOrCreateUser = actionClient
  .schema(z.object({ userId: z.string() }))
  .action<ActionResponse<PrismaUser>>(async ({ parsedInput: { userId } }) => {
    const generateReferralCode = async (): Promise<string> => {
      const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 8)

      const MAX_ATTEMPTS = 10
      let attempts = 0

      while (attempts < MAX_ATTEMPTS) {
        const referralCode = nanoid()
        const { data: existingCode } = await supabase
          .from("users")
          .select("referralCode")
          .eq("referralCode", referralCode)
          .single()

        if (!existingCode) {
          return referralCode
        }

        attempts++
      }

      throw new Error("Unable to generate a unique referral code after 10 attempts")
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select(`
        *,
        wallets:user_wallets(
          id, ownerId, name, publicKey, walletSource, delegated, active, chain
        ),
        subscription:user_subscriptions(
          *,
          payments:subscription_payments(*)
        )
      `)
      .eq("privyId", userId)
      .single()

    if (existingUser) {
      if (!existingUser.referralCode) {
        const referralCode = await generateReferralCode()
        await supabase.from("users").update({ referralCode }).eq("id", existingUser.id)
        existingUser.referralCode = referralCode
      }
      return { success: true, data: existingUser }
    }

    const cookieReferralCode = (await cookies()).get("referralCode")?.value
    let referringUserId: string | null = null

    if (cookieReferralCode) {
      const { data: referringUser } = await supabase
        .from("users")
        .select("id")
        .eq("referralCode", cookieReferralCode)
        .single()

      if (referringUser) {
        referringUserId = referringUser.id
      }
    }

    const referralCode = await generateReferralCode()
    const { data: createdUser, error } = await supabase
      .from("users")
      .insert({ privyId: userId, referralCode, referringUserId })
      .select()
      .single()

    if (error || !createdUser) {
      throw new Error("Failed to create user")
    }

    const { publicKey, encryptedPrivateKey } = await generateEncryptedKeyPair()
    const { data: initialWallet, error: walletError } = await supabase
      .from("user_wallets")
      .insert({
        ownerId: createdUser.id,
        name: "Default",
        publicKey,
        encryptedPrivateKey,
      })
      .select()
      .single()

    if (walletError || !initialWallet) {
      throw new Error("Failed to create initial wallet")
    }

    return {
      success: true,
      data: {
        ...createdUser,
        wallets: [
          {
            id: initialWallet.id,
            ownerId: initialWallet.ownerId,
            name: initialWallet.name,
            publicKey: initialWallet.publicKey,
            walletSource: initialWallet.walletSource,
            delegated: initialWallet.delegated,
            active: initialWallet.active,
            chain: initialWallet.chain,
          },
        ],
        subscription: null,
      },
    }
  })

export const verifyUser = actionClient.action<
  ActionResponse<{
    id: string
    degenMode: boolean
    publicKey?: string
    privyId: string
  }>
>(async () => {
  const token = (await cookies()).get("privy-token")?.value
  if (!token) {
    return {
      success: false,
      error: "No privy token found",
    }
  }

  try {
    const claims = await PRIVY_SERVER_CLIENT.verifyAuthToken(token)
    const { data: user, error } = await supabase
      .from("users")
      .select(`
        id,
        degenMode,
        privyId,
        wallets:user_wallets(publicKey)
      `)
      .eq("privyId", claims.userId)
      .single()

    if (error || !user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    return {
      success: true,
      data: {
        id: user.id,
        privyId: user.privyId,
        publicKey: user.wallets[0]?.publicKey,
        degenMode: user.degenMode,
      },
    }
  } catch {
    return { success: false, error: "Authentication failed" }
  }
})

export const getUserData = actionClient.action<ActionResponse<PrismaUser>>(async () => {
  const token = (await cookies()).get("privy-token")?.value
  if (!token) {
    return {
      success: false,
      error: "No privy token found",
    }
  }

  try {
    const claims = await PRIVY_SERVER_CLIENT.verifyAuthToken(token)

    const response = await getOrCreateUser({ userId: claims.userId })
    if (!response?.data?.success) {
      return { success: false, error: response?.data?.error }
    }

    const user = response.data?.data
    if (!user) {
      return { success: false, error: "Could not create or retrieve user" }
    }

    return { success: true, data: user }
  } catch {
    return { success: false, error: "Authentication failed" }
  }
})

export const syncEmbeddedWallets = actionClient.action<ActionResponse<{ wallets: EmbeddedWallet[] }>>(async () => {
  const response = await getUserData()
  if (!response?.data?.success || !response.data?.data) {
    return { success: false, error: "Local user not found in DB" }
  }

  const userData = response.data.data

  const privyUser = await PRIVY_SERVER_CLIENT.getUser(userData.privyId)

  const embeddedWallets = privyUser.linkedAccounts.filter(
    (acct): acct is WalletWithMetadata => acct.type === "wallet" && acct.walletClientType === "privy",
  )

  try {
    for (const w of embeddedWallets) {
      const pubkey = w.address
      if (!pubkey) continue

      await supabase
        .from("user_wallets")
        .upsert({
          ownerId: userData.id,
          name: "Privy Embedded",
          publicKey: pubkey,
          walletSource: "PRIVY",
          chain: "SOLANA",
          delegated: w.delegated ?? false,
          active: false,
          encryptedPrivateKey: undefined,
        })
        .select()
    }
  } catch (error) {
    return { success: false, error: "Error retrieving updated user" }
  }

  const { data: userWallets, error } = await supabase
    .from("user_wallets")
    .select(`
      id,
      publicKey,
      walletSource,
      delegated,
      name,
      ownerId,
      active,
      chain
    `)
    .eq("ownerId", userData.id)

  if (error) {
    return { success: false, error: "Error retrieving user wallets" }
  }

  return { success: true, data: { wallets: userWallets } }
})

export const getPrivyClient = actionClient.action(async () => PRIVY_SERVER_CLIENT)

export type UserUpdateData = {
  degenMode?: boolean
  referralCode?: string
}
export async function updateUser(data: UserUpdateData) {
  try {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id
    const privyId = authResult?.data?.data?.privyId

    if (!userId) {
      return { success: false, error: "UNAUTHORIZED" }
    }

    const { referralCode, ...updateFields } = data

    if (referralCode) {
      const { data: referringUser, error } = await supabase
        .from("users")
        .select("id, referringUserId")
        .eq("referralCode", referralCode)
        .single()

      if (error || !referringUser) {
        return { success: false, error: "Invalid referral code" }
      }

      if (referringUser.id === userId) {
        return {
          success: false,
          error: "You cannot use your own referral code",
        }
      }

      if (referringUser.referringUserId === userId) {
        return {
          success: false,
          error: "You cannot use a referral code from someone you referred",
        }
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({
          ...updateFields,
          referringUserId: referringUser.id,
        })
        .eq("id", userId)

      if (updateError) {
        throw updateError
      }
    } else {
      const { error: updateError } = await supabase.from("users").update(updateFields).eq("id", userId)

      if (updateError) {
        throw updateError
      }
    }

    revalidateTag(`user-${privyId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export type { PrivyClient } from "@privy-io/server-auth"

