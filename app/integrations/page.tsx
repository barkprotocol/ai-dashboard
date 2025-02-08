"use client"

import { useState } from "react"
import { IntegrationCard } from "@/components/integration-card"
import { integrations } from "@/data/integrations"

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  const handleIntegrationClick = (id: string) => {
    setSelectedIntegration(id)
    // Add logic here to handle integration selection
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">DeFi Integrations</h1>
          <p className="text-lg text-muted-foreground">
            Connect with the most powerful DeFi protocols on Solana. Our integrations enable seamless trading, yield
            farming, and liquidity provision across the ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <div key={integration.id} className="transform transition-all duration-300 hover:-translate-y-1">
              <div className="bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <IntegrationCard
                  item={integration}
                  index={index}
                  onClick={() => handleIntegrationClick(integration.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

