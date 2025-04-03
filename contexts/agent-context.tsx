"use client"

import type * as React from "react"
import { createContext, useContext, useState } from "react"
import type { AgentState, AgentAction } from "@/types/agent"
import { INITIAL_AGENT_STATE } from "@/lib/constants"

// Define the context type
type AgentContextType = {
  agent: AgentState
  dispatch: (action: AgentAction) => void
}

// Create the context
const AgentContext = createContext<AgentContextType | undefined>(undefined)

// Provider component
export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<AgentState>(INITIAL_AGENT_STATE)

  const dispatch = (action: AgentAction) => {
    switch (action.type) {
      case "SET_AGENT":
        setAgent(action.payload)
        break
      case "UPDATE_AGENT":
        setAgent((prev) => ({ ...prev, ...action.payload }))
        break
      case "RESET_AGENT":
        setAgent(INITIAL_AGENT_STATE)
        break
      default:
        console.error("Unknown action type:", action)
    }
  }

  return <AgentContext.Provider value={{ agent, dispatch }}>{children}</AgentContext.Provider>
}

// Hook to use the agent context
export function useAgent() {
  const context = useContext(AgentContext)

  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider")
  }

  return context
}

