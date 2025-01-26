"use client"

import { IntegrationCard } from "./IntegrationCard"
import type { Integration } from "@/types/integrations"

// Define the INTEGRATIONS data
const INTEGRATIONS: Integration[] = [
  {
    label: "Solana",
    description: "High-performance blockchain",
    icon: "/icons/solana.svg",
    theme: {
      primary: "#9945FF",
      secondary: "#14F195",
    },
  },
  {
    label: "Orca",
    description: "Decentralized exchange on Solana",
    icon: "/icons/orca.svg",
    theme: {
      primary: "#00F7C3",
      secondary: "#6BE3C3",
    },
  },
  {
    label: "Raydium",
    description: "Automated market maker on Solana",
    icon: "/icons/raydium.svg",
    theme: {
      primary: "#3365FF",
      secondary: "#C4D8FF",
    },
  },
  {
    label: "Jupiter",
    description: "Liquidity aggregator for Solana",
    icon: "/icons/jupiter.svg",
    theme: {
      primary: "#FF7A45",
      secondary: "#FFD8C2",
    },
  },
]

export function IntegrationsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {INTEGRATIONS.map((item, index) => (
        <IntegrationCard
          key={item.label}
          item={item}
          index={index}
          onClick={() => {
            // Implement integration click handler
            console.log(`Clicked ${item.label}`)
            // Here you can add more functionality, such as opening a modal or navigating to a details page
          }}
        />
      ))}
    </div>
  )
}

