"use client"

import { AgentTemplatesGrid } from "@/components/agents/agent-templates-grid"

export default function TemplatesPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Agent Templates</h1>
      <p className="text-muted-foreground mb-8">
        Choose from our pre-built templates or create your own custom agent from scratch.
      </p>
      <AgentTemplatesGrid />
    </div>
  )
}

