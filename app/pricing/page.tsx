import { ArrowLeft, Zap, Shield, Coins, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PricingCard } from "@/components/pricing/pricing-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/chat">
            <ArrowLeft className="h-5 w-5 text-[#d0c8b9]" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Pricing & Plans</h1>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Choose the Right Plan for Your Needs</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          BARK AI offers flexible pricing options to fit your requirements, from individual users to enterprise teams.
        </p>
      </div>

      <Tabs defaultValue="plans" className="mb-16">
        <TabsList className="hidden">
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Basic"
              description="Perfect for getting started"
              price="Free"
              features={[
                { text: "1,000 messages / month", included: true },
                { text: "Basic AI models", included: true },
                { text: "Community support", included: true },
                { text: "Standard response time", included: true },
                { text: "Access to integrations", included: false },
                { text: "Custom API access", included: false },
                { text: "Priority support", included: false },
              ]}
              buttonText="Current Plan"
            />

            <PricingCard
              title="Pro"
              description="For power users and developers"
              price="100 BARK"
              popular={true}
              features={[
                { text: "10,000 messages / month", included: true },
                { text: "All AI models", included: true },
                { text: "Priority support", included: true },
                { text: "Faster response time", included: true },
                { text: "Access to all integrations", included: true },
                { text: "Custom API access", included: true },
                { text: "Advanced analytics", included: false },
              ]}
              buttonText="Upgrade to Pro"
            />

            <PricingCard
              title="Enterprise"
              description="For teams and organizations"
              price="500 BARK"
              features={[
                { text: "Unlimited messages", included: true },
                { text: "All AI models", included: true },
                { text: "Dedicated support", included: true },
                { text: "Fastest response time", included: true },
                { text: "Custom integrations", included: true },
                { text: "Advanced API access", included: true },
                { text: "Team management", included: true },
              ]}
              buttonText="Contact Sales"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">How BARK AI Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="bg-black p-3 rounded-md">
              <Zap className="h-6 w-6 text-[#d0c8b9]" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">AI Models</h3>
              <p className="text-muted-foreground">
                BARK AI uses advanced language models like GPT-4o, Claude, and DeepSeek to provide intelligent responses
                to your queries about Solana and crypto.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-black p-3 rounded-md">
              <Shield className="h-6 w-6 text-[#d0c8b9]" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Solana Integration</h3>
              <p className="text-muted-foreground">
                BARK AI connects directly to the Solana blockchain to provide real-time data, transaction capabilities,
                and DeFi interactions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-black p-3 rounded-md">
              <Coins className="h-6 w-6 text-[#d0c8b9]" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Token Economy</h3>
              <p className="text-muted-foreground">
                BARK tokens power the ecosystem, providing governance rights, enhanced access, and rewards for
                contributors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-black p-3 rounded-md">
              <Users className="h-6 w-6 text-[#d0c8b9]" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Community Governance</h3>
              <p className="text-muted-foreground">
                BARK token holders can participate in protocol decisions and vote on future features and improvements.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black text-white dark:bg-white dark:text-black rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
          Join thousands of users who are already using BARK AI to navigate the Solana ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-zinc-900"
            asChild
          >
            <Link href="/chat">Try for Free</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 dark:border-black dark:text-black dark:hover:bg-black/10"
            asChild
          >
            <Link href="/docs">Learn More</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-xl font-medium mb-4">Frequently Asked Questions</h3>
        <p className="text-muted-foreground mb-4">Have more questions about our pricing or features?</p>
        <Button variant="outline" asChild>
          <Link href="/docs/faq">Visit our FAQ</Link>
        </Button>
      </div>
    </div>
  )
}

