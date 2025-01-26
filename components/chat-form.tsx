"use client"

import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void append({ content: input, role: "user" })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const header = (
    <header className="m-auto flex max-w-2xl flex-col gap-5 text-center">
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">BARK AI Agent Platform</h1>
      <p className="text-muted-foreground text-sm max-w-[42rem] text-center mx-auto">
        Welcome to the BARK AI Agent Platform, your intelligent copilot for Solana. Optimize your DeFi experience with
        AI-powered insights and automated trading strategies.
      </p>
      <p className="text-muted-foreground text-sm max-w-[42rem] text-center mx-auto">
        Ask questions about Solana DeFi, request trading advice, or get help navigating the BARK ecosystem.
      </p>
    </header>
  )

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4 items-center">
      {messages.map((message, index) => (
        <div
          key={index}
          data-role={message.role}
          className={cn(
            "max-w-[80%] rounded-xl px-3 py-2 text-sm",
            message.role === "assistant" ? "self-start bg-gray-100 text-black" : "self-end bg-gray-500 text-white",
          )}
        >
          {message.content}
        </div>
      ))}
    </div>
  )

  return (
    <main
      className={cn(
        "ring-none mx-auto flex h-svh max-h-svh w-full max-w-[50rem] flex-col items-center justify-center border-none px-4",
        className,
      )}
      {...props}
    >
      <div className="flex-1 w-full overflow-y-auto px-6 flex flex-col items-center justify-center">
        {messages.length ? messageList : header}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0 w-full max-w-2xl"
      >
        <AutoResizeTextarea
          onKeyDown={handleKeyDown}
          onChange={(v) => setInput(v)}
          value={input}
          placeholder="Ask about Solana DeFi or BARK strategies..."
          className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="absolute bottom-1 right-1 size-6 rounded-full">
              <ArrowUpIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={12}>Submit</TooltipContent>
        </Tooltip>
      </form>
    </main>
  )
}

