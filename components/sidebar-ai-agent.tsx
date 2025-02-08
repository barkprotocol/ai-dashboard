// NOTE: For v0 preview, Prisma-related code is commented out or removed.
// Uncomment and adjust as needed when database functionality is required.

"use client"

import { useState, useEffect, useCallback } from "react"
import { Bot, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface Performance {
  responseTime: number
  accuracy: number
  efficiency: number
}

export function SidebarAIAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [performance, setPerformance] = useState<Performance>({
    responseTime: 0,
    accuracy: 0,
    efficiency: 0,
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Prisma query replaced with mock data for v0 preview
    setMessages([
      { id: "1", role: "user", content: "Hello" },
      { id: "2", role: "assistant", content: "Hi there! How can I help you?" },
    ])
    const interval = setInterval(() => {
      setPerformance({
        responseTime: Math.random() * 100,
        accuracy: Math.random() * 100,
        efficiency: Math.random() * 100,
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleAgentInteraction = useCallback(async () => {
    setIsLoading(true)
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: "Tell me about the current DeFi market trends.",
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "The DeFi market is currently experiencing significant growth, with increased interest in yield farming and liquidity mining. Decentralized exchanges (DEXs) are gaining popularity, and cross-chain interoperability solutions are becoming more prevalent.",
      }
      setMessages((prevMessages) => [...prevMessages, aiMessage])
      setIsLoading(false)
    }, 2000)
  }, [])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="fixed right-0 top-0 h-full bg-background border-l border-border shadow-lg overflow-hidden"
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AI Agent</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold">{performance.responseTime.toFixed(2)}ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-2xl font-bold">{performance.accuracy.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-2xl font-bold">{performance.efficiency.toFixed(2)}%</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Recent Interactions</h3>
                  <div className="space-y-2">
                    {messages.slice(-5).map((message) => (
                      <div key={message.id} className="p-2 bg-muted rounded-md">
                        <p className="text-sm font-medium">{message.role === "user" ? "You" : "AI"}</p>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <Button onClick={handleAgentInteraction} disabled={isLoading} className="w-full">
                {isLoading ? "Processing..." : "Interact with AI Agent"}
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed right-4 bottom-4"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg"
                  onClick={() => setIsOpen(true)}
                >
                  <Bot className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Open AI Agent Sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

