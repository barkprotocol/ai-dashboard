"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { checkEAPTransaction } from "@/app/server/actions/eap"

export function EAPTransactionChecker() {
  const [transactionHash, setTransactionHash] = useState("")
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckTransaction = async () => {
    if (!transactionHash) {
      setResult({ success: false, message: "Please enter a transaction hash." })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await checkEAPTransaction({ txHash: transactionHash })
      if (response.success) {
        setResult({ success: true, message: "Transaction verified successfully. Welcome to the Early Access Program!" })
      } else {
        setResult({ success: false, message: response.error || "Failed to verify transaction." })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred while checking the transaction." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>EAP Transaction Checker</CardTitle>
        <CardDescription>Verify your Early Access Program transaction</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter transaction hash"
          value={transactionHash}
          onChange={(e) => setTransactionHash(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleCheckTransaction} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Transaction"
          )}
        </Button>
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

