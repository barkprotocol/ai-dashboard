"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { cn } from "@/lib/utils"

interface BrevityProps {
  content: string
  maxLength?: number
}

export function Brevity({ content, maxLength = 280 }: BrevityProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [customLength, setCustomLength] = useState(maxLength)

  const truncatedContent = isExpanded ? content : content.slice(0, customLength)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSliderChange = (value: number[]) => {
    setCustomLength(value[0])
  }

  return (
    <div className="space-y-2">
      <p className={cn("text-sm text-gray-700 dark:text-gray-300", !isExpanded && "line-clamp-3")}>
        {truncatedContent}
      </p>
      {content.length > maxLength && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
          <div className="flex items-center space-x-2">
            <Slider
              min={50}
              max={content.length}
              step={10}
              value={[customLength]}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">{customLength} chars</span>
          </div>
        </>
      )}
    </div>
  )
}

