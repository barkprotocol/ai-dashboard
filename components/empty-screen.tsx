import type { UseChatHelpers } from "ai/react"

import { Button } from "@/components/ui/button"
import ExternalLink from "@/components/external-link"

const exampleMessages = [
  {
    heading: "Explain technical concepts",
    message: `What is a "serverless function"?`,
  },
  {
    heading: "Summarize an article",
    message: "Summarize the following article for me:\n\nhttps://www.bbc.com/news/science-environment-56901261",
  },
  {
    heading: "Draft an email",
    message: `Draft an email to my boss about taking a vacation next week.`,
  },
]

export default function EmptyScreen({ setInput }: Pick<UseChatHelpers, "setInput">) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Welcome to AI Chat Assistant!</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an open source AI chat app template built with{" "}
          <ExternalLink href="https://nextjs.org">Next.js</ExternalLink> and{" "}
          <ExternalLink href="https://vercel.com/blog/introducing-the-vercel-ai-sdk">Vercel AI SDK</ExternalLink>.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
                className="mr-2 h-4 w-4"
                strokeWidth="2"
              >
                <path
                  d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                  fill="currentColor"
                ></path>
              </svg>
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

