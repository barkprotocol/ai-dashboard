"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface TypingAnimationProps {
  text: string
  duration?: number
  className?: string
}

export function TypingAnimation({ text, duration = 200, className }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")

  const animateText = useCallback(() => {
    let currentIndex = 0
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex])
        currentIndex++
      } else {
        clearInterval(intervalId)
      }
    }, duration)

    return () => clearInterval(intervalId)
  }, [text, duration])

  useEffect(() => {
    setDisplayedText("")
    const cleanup = animateText()
    return cleanup
  }, [animateText])

  return (
    <h1
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className,
      )}
    >
      {displayedText}
    </h1>
  )
}

