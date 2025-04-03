"use client"

import { CardFooter } from "@/components/ui/card"

import { SelectItem } from "@/components/ui/select"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAgents } from "@/hooks/use-agents"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2, Info, Upload } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { AgentFunction } from "@/types/agent"

// Sample agent functions
const sampleFunctions: AgentFunction[] = [
  {
    id: "1",
    name: "searchWeb",
    description: "Search the web for information",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "The search query",
        required: true,
      },
      {
        name: "maxResults",
        type: "number",
        description: "Maximum number of results to return",
        required: false,
        defaultValue: 5,
      },
    ],
    enabled: false,
  },
  {
    id: "2",
    name: "fetchTokenPrice",
    description: "Fetch the current price of a token",
    parameters: [
      {
        name: "tokenSymbol",
        type: "string",
        description: "The token symbol (e.g., SOL, BTC)",
        required: true,
      },
    ],
    enabled: false,
  },
  {
    id: "3",
    name: "generateImage",
    description: "Generate an image based on a text prompt",
    parameters: [
      {
        name: "prompt",
        type: "string",
        description: "The text prompt for image generation",
        required: true,
      },
      {
        name: "style",
        type: "string",
        description: "The style of the image",
        required: false,
        defaultValue: "realistic",
      },
    ],
    enabled: false,
  },
  {
    id: "4",
    name: "analyzeSentiment",
    description: "Analyze the sentiment of a text",
    parameters: [
      {
        name: "text",
        type: "string",
        description: "The text to analyze",
        required: true,
      },
    ],
    enabled: false,
  },
  {
    id: "5",
    name: "sendBarkTokens",
    description: "Send BARK tokens to a specified address",
    parameters: [
      {
        name: "recipientAddress",
        type: "string",
        description: "The recipient's wallet address",
        required: true,
      },
      {
        name: "amount",
        type: "number",
        description: "The amount of BARK tokens to send",
        required: true,
      },
    ],
    enabled: false,
  },
]

export default function CreateAgentPage() {
  const router = useRouter()
  const { createAgent, isLoading } = useAgents({ initialFetch: false })
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    model: "GPT-4o",
    category: "general",
    isPublic: true,
    features: "",
    price: "10",
    barkEnabled: false,
    icon: "",
    listingPrice: "5",
    creationFee: "50",
  })

  const [functions, setFunctions] = useState<AgentFunction[]>(sampleFunctions)
  const [selectedFunctionId, setSelectedFunctionId] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const toggleFunction = (id: string) => {
    setFunctions((prev) => prev.map((func) => (func.id === id ? { ...func, enabled: !func.enabled } : func)))

    // If enabling a function, select it for editing
    const func = functions.find((f) => f.id === id)
    if (func && !func.enabled) {
      setSelectedFunctionId(id)
    } else if (selectedFunctionId === id) {
      setSelectedFunctionId(null)
    }
  }

  const updateFunctionParameter = (functionId: string, paramName: string, field: string, value: any) => {
    setFunctions((prev) =>
      prev.map((func) =>
        func.id === functionId
          ? {
              ...func,
              parameters: func.parameters.map((param) =>
                param.name === paramName ? { ...param, [field]: value } : param,
              ),
            }
          : func,
      ),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const featuresArray = formData.features
        .split(",")
        .map((feature) => feature.trim())
        .filter((feature) => feature.length > 0)

      const enabledFunctions = functions.filter((func) => func.enabled)

      await createAgent({
        title: formData.title,
        description: formData.description,
        model: formData.model,
        category: formData.category,
        isPublic: formData.isPublic,
        verified: false,
        barkEnabled: formData.barkEnabled,
        features: featuresArray,
        price: Number.parseInt(formData.price),
        createdBy: "user",
        icon: formData.icon,
        listingPrice: Number.parseInt(formData.listingPrice),
        creationFee: Number.parseInt(formData.creationFee),
        functions: enabledFunctions,
      })

      toast({
        title: "Agent created",
        description: "Your AI agent has been created successfully.",
      })

      router.push("/agents")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/agents" className="mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create new AI Agent</h1>
        </div>

        <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                How Agent Creation Works
                <div className="relative w-6 h-6">
                  <Image
                    src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
                    alt="BARK"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              </DialogTitle>
              <DialogDescription>Learn about creating and publishing your own AI agents</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="font-medium">Creation Process</h3>
                <p className="text-sm text-muted-foreground">
                  Creating an agent involves defining its capabilities, functions, and parameters. You'll need to pay a
                  creation fee in BARK tokens.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Listing Your Agent</h3>
                <p className="text-sm text-muted-foreground">
                  You can list your agent publicly or keep it private. Public agents require a listing fee and can be
                  used by others for a price you set.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Functions & Parameters</h3>
                <p className="text-sm text-muted-foreground">
                  Functions give your agent special capabilities like web search or token transfers. Each function has
                  parameters that control its behavior.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">BARK Token Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Enabling BARK token support allows your agent to interact with the Solana blockchain and handle token
                  transactions.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Agent Details</CardTitle>
                <CardDescription>Fill in the details to create your custom AI agent.</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-[#d0c8b9]">
                <div className="relative w-8 h-8">
                  <Image
                    src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
                    alt="BARK"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium">Powered by BARK</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title">Agent Name</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Code Assistant"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Agent Icon</Label>
                <div className="flex gap-2">
                  <Input
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="URL or upload"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" className="shrink-0">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what your agent does..."
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={formData.model} onValueChange={(value) => handleSelectChange("model", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                    <SelectItem value="GPT-4">GPT-4</SelectItem>
                    <SelectItem value="Claude 3 Opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="Claude 3 Sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="Llama 3">Llama 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="defi">DeFi</SelectItem>
                    <SelectItem value="charity">Charity</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Usage Price (tokens)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="listingPrice">Listing Price (BARK)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="listingPrice"
                    name="listingPrice"
                    type="number"
                    value={formData.listingPrice}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                  <div className="relative w-5 h-5">
                    <Image
                      src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
                      alt="BARK"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creationFee">Creation Fee (BARK)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="creationFee"
                    name="creationFee"
                    type="number"
                    value={formData.creationFee}
                    onChange={handleChange}
                    min="0"
                    disabled
                    className="bg-muted/50"
                  />
                  <div className="relative w-5 h-5">
                    <Image
                      src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
                      alt="BARK"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Fixed fee for creating an agent</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="e.g., Code generation, Debugging, Code explanation"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleSwitchChange("isPublic", checked)}
                />
                <Label htmlFor="isPublic">Make this agent public</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="barkEnabled"
                  checked={formData.barkEnabled}
                  onCheckedChange={(checked) => handleSwitchChange("barkEnabled", checked)}
                />
                <Label htmlFor="barkEnabled" className="flex items-center gap-2">
                  Enable BARK token integration
                  <div className="relative w-4 h-4">
                    <Image
                      src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
                      alt="BARK"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </div>
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Agent Functions</Label>
                <Badge variant="outline" className="text-xs">
                  {functions.filter((f) => f.enabled).length} of {functions.length} enabled
                </Badge>
              </div>

              <Card className="border-dashed">
                <CardContent className="p-4 space-y-4">
                  {functions.map((func) => (
                    <div key={func.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`function-${func.id}`}
                            checked={func.enabled}
                            onCheckedChange={() => toggleFunction(func.id)}
                          />
                          <Label htmlFor={`function-${func.id}`} className="font-medium">
                            {func.name}
                          </Label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {func.parameters.length} params
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground ml-10">{func.description}</p>

                      {func.enabled && selectedFunctionId === func.id && (
                        <div className="ml-10 mt-2 border rounded-md p-3 bg-muted/20">
                          <h4 className="text-sm font-medium mb-2">Parameters</h4>
                          {func.parameters.map((param) => (
                            <div key={param.name} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                              <div className="space-y-1">
                                <Label htmlFor={`param-${func.id}-${param.name}`} className="text-xs">
                                  {param.name} ({param.type}){param.required && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                  id={`param-${func.id}-${param.name}`}
                                  value={param.defaultValue || ""}
                                  onChange={(e) =>
                                    updateFunctionParameter(func.id, param.name, "defaultValue", e.target.value)
                                  }
                                  placeholder="Default value"
                                  size={1}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{param.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="outline" onClick={() => router.push("/agents")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Agent"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

