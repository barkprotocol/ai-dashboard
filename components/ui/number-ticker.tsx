"use client"

import { useMotionValue, animate } from "framer-motion"
import { useEffect, useCallback, useRef } from "react"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

interface NumberTickerProps {
  value: number
  direction?: "up" | "down"
  className?: string
  delay?: number
  decimalPlaces?: number
  duration?: number
  locale?: string
  ease?: string
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  duration = 2,
  locale = "en-US",
  ease = "easeOut",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [refInView, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  const motionValue = useMotionValue(direction === "down" ? value : 0)

  const formatNumber = useCallback(
    (num: number) =>
      Intl.NumberFormat(locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(num.toFixed(decimalPlaces))),
    [decimalPlaces, locale],
  )

  useEffect(() => {
    if (!inView || typeof value !== "number") return

    const timeoutId = setTimeout(() => {
      const controls = animate(motionValue, direction === "down" ? 0 : value, {
        duration,
        ease,
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = formatNumber(latest)
          }
        },
      })

      return () => {
        controls.stop()
        clearTimeout(timeoutId)
      }
    }, delay * 1000)

    return () => clearTimeout(timeoutId)
  }, [motionValue, inView, delay, value, direction, duration, formatNumber, ease])

  return (
    <span className={cn("inline-block", className)} ref={refInView}>
      <span ref={ref}>0</span>
    </span>
  )
}

