export interface Integration {
  id: string
  label: string
  description?: string
  icon: string
  theme: {
    primary: string
    secondary: string
  }
}

export const integrations: Integration[] = [
  {
    id: "jupiter",
    label: "Jupiter",
    description: "Leading Solana DEX aggregator for best swap rates",
    icon: "https://ucarecdn.com/80fffad0-0b23-4004-b942-a7ac8b20462d/jupiteragjuplogo.svg",
    theme: {
      primary: "#F15A24",
      secondary: "#FBB03B",
    },
  },
  {
    id: "orca",
    label: "Orca",
    description: "User-friendly automated market maker (AMM)",
    icon: "https://ucarecdn.com/20144fb1-9521-4813-b025-0dd8ab0689d5/orcaorcalogo.svg",
    theme: {
      primary: "#00C1B4",
      secondary: "#00E7D9",
    },
  },
  {
    id: "raydium",
    label: "Raydium",
    description: "Premier AMM and yield farming protocol",
    icon: "https://ucarecdn.com/1f97ba42-b199-4a36-a545-aa653333b2f7/raydium.png",
    theme: {
      primary: "#2B6AFF",
      secondary: "#1ED7FF",
    },
  },
  {
    id: "marinade",
    label: "Marinade",
    description: "Liquid staking solution for Solana",
    icon: "/icons/marinade.svg",
    theme: {
      primary: "#FF8E00",
      secondary: "#FFB800",
    },
  },
  {
    id: "meteora",
    label: "Meteora",
    description: "Concentrated liquidity AMM with dynamic fees",
    icon: "/icons/meteora.svg",
    theme: {
      primary: "#7C3AED",
      secondary: "#A78BFA",
    },
  },
  {
    id: "pump",
    label: "Pump.fun",
    description: "Fair-launch token platform with bonding curves",
    icon: "https://ucarecdn.com/e2f52364-b75b-4588-b3aa-c9c97989124f/pumpfun.jpeg",
    theme: {
      primary: "#FF3B30",
      secondary: "#FF9500",
    },
  },
  {
    id: "dialect",
    label: "Dialect",
    description: "Web3 messaging and notifications protocol",
    icon: "/icons/dialect.svg",
    theme: {
      primary: "#6366F1",
      secondary: "#818CF8",
    },
  },
  {
    id: "metaplex",
    label: "Metaplex",
    description: "NFT standard and tooling for Solana",
    icon: "/icons/metaplex.svg",
    theme: {
      primary: "#14F195",
      secondary: "#9945FF",
    },
  },
  {
    id: "dexscreener",
    label: "DexScreener",
    description: "Real-time DEX trading charts and analytics",
    icon: "https://ucarecdn.com/43a0c33f-bb25-46a1-a2a1-e81b3ac91f54/dexscreener.png",
    theme: {
      primary: "#00FF88",
      secondary: "#00FFEE",
    },
  },
  {
    id: "openbook",
    label: "OpenBook",
    description: "Open-source central limit order book DEX",
    icon: "https://ucarecdn.com/eafc9123-e16b-4ff3-9e3c-4865eb026b30/openbook.ico",
    theme: {
      primary: "#41D7AA",
      secondary: "#41B7D7",
    },
  },
  {
    id: "magiceden",
    label: "Magic Eden",
    description: "Leading NFT marketplace on Solana",
    icon: "/icons/magiceden.svg",
    theme: {
      primary: "#E42575",
      secondary: "#FB5DC3",
    },
  },
  {
    id: "helius",
    label: "Helius",
    description: "Enterprise-grade RPC and APIs for Solana",
    icon: "/icons/helius.svg",
    theme: {
      primary: "#3B82F6",
      secondary: "#60A5FA",
    },
  },
  {
    id: "birdeye",
    label: "Birdeye",
    description: "Real-time DeFi analytics and trading platform",
    icon: "https://ucarecdn.com/7012a8a5-cded-4837-9057-6cbcdf4cb350/birdeye.png",
    theme: {
      primary: "#FF8C00",
      secondary: "#FFA500",
    },
  },
  {
    id: "phantom",
    label: "Phantom",
    description: "Leading Solana wallet with built-in DEX and NFT support",
    icon: "https://ucarecdn.com/131df107-69cb-435b-bb7d-8104d500ceab/phantom.png",
    theme: {
      primary: "#AB9FF2",
      secondary: "#B5A5FF",
    },
  },
]

