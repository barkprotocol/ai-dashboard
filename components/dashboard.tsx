"use client"

import { Loader2 } from "lucide-react"

export function Dashboard() {
  return (
    <div className="w-full md:w-80 lg:w-96 border-l bg-background flex flex-col h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
    </div>
  )
}

