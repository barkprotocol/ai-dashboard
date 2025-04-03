"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AvatarUpload } from "@/components/account/avatar-upload"
import { WalletConnector } from "@/components/wallet/wallet-connector"
import { useWallet } from "@/hooks/use-wallet"
import { ProfileTab } from "@/components/account/profile-tab"
import { SecurityTab } from "@/components/account/security-tab"
import { APITab } from "@/components/account/api-tab"
import { IntegrationsTab } from "@/components/account/integrations-tab"
import { AISettingsTab } from "@/components/account/ai-settings-tab"
import { WalletSection } from "@/components/account/wallet-section"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { walletData } = useWallet()

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Profile Summary */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                initialAvatarUrl="https://sjc.microlink.io/hOJ3tzTB_hXyP2sPlbWL0V36HPmnVrdTJtdA_KYd1d-0TwOGH-CTI6O7Tc2236bcid_jfGEoPwACJFGi2NgbJw.jpeg"
                username="John Doe"
              />

              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Username</span>
                  <span className="text-sm">johndoe</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Email</span>
                  <span className="text-sm">john.doe@example.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Account Type</span>
                  <Badge variant="outline">Pro</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm">Jan 2023</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Wallet Status</h3>
                {walletData.isConnected ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 dark:text-green-500 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Connected
                    </span>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                ) : (
                  <WalletConnector variant="black" size="sm" />
                )}
              </div>
            </CardContent>
          </Card>

          <WalletSection />
        </div>

        {/* Right Column - Tabs */}
        <div className="w-full md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="ai">AI Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>

            <TabsContent value="api">
              <APITab />
            </TabsContent>

            <TabsContent value="integrations">
              <IntegrationsTab />
            </TabsContent>

            <TabsContent value="ai">
              <AISettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

