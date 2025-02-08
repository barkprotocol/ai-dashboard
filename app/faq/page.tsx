"use client"

import { EAPTransactionChecker } from "@/components/eap-transaction-checker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FaqItem {
  id: string
  question: string
  answer: string | React.ReactNode
}

const faqItems: FaqItem[] = [
  {
    id: "item-1",
    question: "What is BARK AI?",
    answer:
      "BARK AI is an advanced AI-powered DeFi assistant that helps users navigate the Solana ecosystem. It combines natural language processing with deep blockchain integration to provide real-time trading insights, portfolio management, and automated DeFi operations.",
  },
  {
    id: "item-2",
    question: "I paid for Early Access Program, but still not showing up?",
    answer: (
      <div className="space-y-4">
        <span>
          It usually takes 5~30 seconds for the EAP to be granted to your account.
          <br />
          If the EAP is not granted, please paste your transaction hash into the transaction checker below.
        </span>
        <EAPTransactionChecker />
      </div>
    ),
  },
  {
    id: "item-3",
    question: "How secure is BARK AI?",
    answer:
      "BARK AI prioritizes security through multiple layers: client-side encryption, secure wallet integration, and no storage of private keys. All AI interactions are encrypted, and blockchain transactions require explicit user confirmation unless Degen Mode is enabled.",
  },
  {
    id: "item-4",
    question: "Can I export my embedded wallet?",
    answer:
      "Unfortunately, to ensure maximum security, we currently do not support exporting embedded wallets. We will be integrating with established embedded wallet providers soon to provide more wallet control options.",
  },
  {
    id: "item-5",
    question: "How can I become EAP Verified in Discord?",
    answer:
      "On the bottom left, tap your wallet, then tap 'Account'. Next, click the 'Connect' button next to Discord. Once connected to the Discord server, you'll receive the 'EAP VERIFIED' role and access to exclusive channels.",
  },
  {
    id: "item-6",
    question: "What DeFi protocols are supported?",
    answer:
      "BARK AI integrates with major Solana DeFi protocols including Jupiter, Orca, Raydium, Marinade, and more. Check our Integrations page for the complete list of supported protocols and features.",
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Tabs defaultValue="how-it-works" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="how-it-works" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>System Architecture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <pre className="mermaid">
                      {`
graph TD
  A["Frontend (Next.js)"] --&gt; B["AI Layer"]
  B --&gt; C["Language Models"]
  B --&gt; D["Tool Integration"]
  D --&gt; E["DeFi Protocols"]
  D --&gt; F["Blockchain RPC"]
  A --&gt; G["Wallet Integration"]
  G --&gt; H["Transaction Signing"]
  H --&gt; I["Solana Network"]
  E --&gt; I
  F --&gt; I
`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="space-y-8">
              {faqItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>{item.answer}</CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

