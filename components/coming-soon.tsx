import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComingSoonPageProps {
  icon: LucideIcon
  title: string
}

export function ComingSoonPage({ icon: Icon, title }: ComingSoonPageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="text-center">
          <Icon className="w-20 h-20 mx-auto mb-6 text-primary/50" />
          <CardTitle className="text-3xl font-bold text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 text-lg">
            This feature is coming soon. Stay tuned for exciting updates!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

