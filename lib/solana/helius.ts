import { LAMPORTS_PER_SOL } from "@solana/web3.js"

import { chunkArray } from "@/lib/utils"
import rawKnownAddresses from "@/lib/utils/known-addresses.json"
import type { FungibleToken, NonFungibleToken } from "@/types/helius/portfolio"
import { HELIUS_API_KEY } from "../constants"

import { RPC_URL } from "../constants"

export interface Holder {
  owner: string
  balance: number
  classification?: string
}

interface MintInfo {
  mint: string
  decimals: number
  supply: bigint
  isInitialized: boolean
  freezeAuthority: string
  mintAuthority: string
}

type HeliusMethod =
  | "searchAssets"
  | "getBalance"
  | "getTokenAccounts"
  | "getAccountInfo"
  | "getMultipleAccounts"
  | "getTokenLargestAccounts"

const KNOWN_ADDRESSES: Record<string, string> = rawKnownAddresses as Record<string, string>

const fetchHelius = async (method: HeliusMethod, params: any) => {
  try {
    const response = await fetch(RPC_URL, {
      next: { revalidate: 5 },
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "request-id",
        method: method,
        params: params, // some methods require objects, some require arrays
      }),
    })

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    if (data.error) {
      throw new Error(`Helius API error: ${data.error.message || JSON.stringify(data.error)}`)
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Helius API request failed: ${error.message}`)
    }
    throw new Error("Helius API request failed with unknown error")
  }
}

export const getBalance: (walletAddress: string) => Promise<number> = async (walletAddress: string) => {
  const data = await fetchHelius("getBalance", [walletAddress])
  return Number(data.result.balance) / LAMPORTS_PER_SOL
}

const HELIUS_API_URL = `https://api.helius.xyz/v0`

export async function searchWalletAssets(address: string) {
  const url = `${HELIUS_API_URL}/addresses/${address}/balances?api-key=${HELIUS_API_KEY}`
  const response = await fetch(url)
  const data = await response.json()

  const fungibleTokens: FungibleToken[] = data.tokens
  const nonFungibleTokens: NonFungibleToken[] = data.nfts

  return { fungibleTokens, nonFungibleTokens }
}

export async function getMintAccountInfo(mint: string): Promise<MintInfo> {
  const data = await fetchHelius("getAccountInfo", [mint, { encoding: "jsonParsed" }])

  if (!data.result || !data.result.value) {
    throw new Error(`No account info found for mint: ${mint}`)
  }

  const value = data.result.value
  if (!value.data || !value.data.parsed || value.data.parsed.type !== "mint") {
    throw new Error(`Account is not a valid SPL mint: ${mint}`)
  }

  const info = value.data.parsed.info
  return {
    mint,
    decimals: info.decimals,
    supply: BigInt(info.supply),
    isInitialized: info.isInitialized,
    freezeAuthority: info.freezeAuthority,
    mintAuthority: info.mintAuthority,
  }
}

/**
 * Fetches all holders for a given mint (via "getTokenAccounts"),
 * returning a Map of `address -> Holder`.
 */
export async function getTokenHolders(mintInfo: MintInfo): Promise<Map<string, Holder>> {
  let page = 1
  const holderMap = new Map<string, Holder>()

  while (page <= 100) {
    const data = await fetchHelius("getTokenAccounts", {
      page,
      limit: 1000,
      displayOptions: {},
      mint: mintInfo.mint,
    })

    if (!data.result || data.result.token_accounts.length === 0) {
      break // no more results
    }

    data.result.token_accounts.forEach((account: any) => {
      const owner = account.owner
      const balanceRaw = BigInt(account.amount || "0")
      const balance = Number(balanceRaw) / 10 ** mintInfo.decimals

      if (holderMap.has(owner)) {
        const h = holderMap.get(owner)!
        h.balance += balance
      } else {
        holderMap.set(owner, {
          owner,
          balance: balance,
        })
      }
    })

    page++
  }

  return holderMap
}

export const getTokenAccountInfo = async (address: string) => {
  const data = await fetchHelius("getAccountInfo", [address, { encoding: "jsonParsed" }])
  return data.result.value
}

export async function getTopTokenHolders(mintInfo: MintInfo): Promise<Map<string, Holder>> {
  const data = await fetchHelius("getTokenLargestAccounts", [mintInfo.mint])

  if (!data.result || data.result.value.length === 0) {
    throw new Error("No token holders found")
  }
  const tokenAccountAddresses = data.result.value.map((a: any) => a.address)

  const holderMap = new Map<string, Holder>()
  const tokenAccountsResponse = await getMultipleAccountsInfoHelius(tokenAccountAddresses)

  const tokenAccounts = tokenAccountsResponse?.result?.value
  if (!tokenAccounts || !Array.isArray(tokenAccounts)) {
    return holderMap
  }
  for (const tokenAccount of tokenAccounts) {
    const balance = tokenAccount.data.parsed.info.tokenAmount.uiAmount
    const owner = tokenAccount.data.parsed.info.owner
    if (holderMap.has(owner)) {
      const h = holderMap.get(owner)!
      h.balance += balance
    } else {
      holderMap.set(owner, {
        owner: owner,
        balance: balance,
      })
    }
  }

  return holderMap
}

/**
 * Fetches total number of holders returns -1 if there are more than 50k holders
 */
export async function getTokenHolderCount(mintInfo: MintInfo): Promise<number> {
  const PAGE_SIZE = 1000
  let page = 1
  const allOwners = new Set()

  while (page <= 100) {
    const data = await fetchHelius("getTokenAccounts", {
      page,
      limit: 1000,
      displayOptions: {},
      mint: mintInfo.mint,
    })

    if (!data.result || data.result.token_accounts.length === 0) {
      break
    }

    data.result.token_accounts.forEach((account: any) => allOwners.add(account.owner))

    if (data.result.token_accounts.length < PAGE_SIZE) {
      break
    }

    page++
  }
  if (allOwners.size > 50000) {
    return -1
  }
  return allOwners.size
}

/**
 * Use "getMultipleAccounts" in a single RPC call for a list of addresses
 */
async function getMultipleAccountsInfoHelius(addresses: string[]) {
  return await fetchHelius("getMultipleAccounts", [addresses, { encoding: "jsonParsed" }])
}

/**
 * Classify a list of addresses (subset of holders).
 * - If address is in ACCOUNT_LABELS, use that.
 * - Else look at the account's `owner` program → PROGRAM_LABELS or fallback.
 * - Mutates the `Holder.classification` in `holderMap`.
 */
async function classifyAddresses(holderMap: Map<string, Holder>, addresses: string[], chunkSize = 20) {
  const addressChunks = chunkArray(addresses, chunkSize)

  for (const chunk of addressChunks) {
    const response = await getMultipleAccountsInfoHelius(chunk)
    const accountInfos = response?.result?.value

    if (!accountInfos || !Array.isArray(accountInfos)) {
      continue
    }

    for (let i = 0; i < chunk.length; i++) {
      const addr = chunk[i]
      const accInfo = accountInfos[i]
      const holder = holderMap.get(addr)
      if (!holder) continue

      // If address is in ACCOUNT_LABELS
      if (addr in KNOWN_ADDRESSES) {
        holder.classification = KNOWN_ADDRESSES[addr]
        continue
      }

      // Otherwise check `accInfo.owner`
      if (accInfo && accInfo.owner) {
        const programId = accInfo.owner
        holder.classification = KNOWN_ADDRESSES[programId] ?? `Unrecognized Program`
      } else {
        holder.classification = "Unknown or Doesn't Exist"
      }
    }
  }
}

export async function getHoldersClassification(mint: string, limit = 10) {
  const mintAccountInfo = await getMintAccountInfo(mint)
  const totalSupply = Number(mintAccountInfo.supply) / 10 ** mintAccountInfo.decimals

  const topHolderMap = await getTopTokenHolders(mintAccountInfo)
  const totalHolders = await getTokenHolderCount(mintAccountInfo)

  const sortedHolders = Array.from(topHolderMap.values()).sort((a, b) => {
    return b.balance > a.balance ? 1 : b.balance < a.balance ? -1 : 0
  })

  const topHolders = sortedHolders.slice(0, limit)
  await classifyAddresses(
    topHolderMap,
    topHolders.map((h) => h.owner),
    limit,
  )

  return {
    totalHolders,
    topHolders,
    totalSupply,
  }
}

