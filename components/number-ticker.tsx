import { useMotionValue, animate } from "framer-motion"
import { useEffect, useCallback, useRef } from "react"
import { useInView } from "react-intersection-observer"

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

export default function NumberTicker({
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
  const [refInView, isInView] = useInView({
    threshold: 0.5,
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
    if (!isInView || typeof value !== "number") return

    const timeoutId = setTimeout(() => {
      const controls = animate(motionValue, direction === "down" ? 0 : value, {
        duration,
        ease,
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Intl.NumberFormat(locale, {
              minimumFractionDigits: decimalPlaces,
              maximumFractionDigits: decimalPlaces,
            }).format(Number(latest.toFixed(decimalPlaces)))
          }
        },
      })

      return () => {
        controls.stop()
        clearTimeout(timeoutId)
      }
    }, delay * 1000)

    return () => clearTimeout(timeoutId)
  }, [motionValue, isInView, delay, value, direction, duration, decimalPlaces, locale, ease])

  return (
    <span className={className} ref={refInView} ref={ref}>
      0
    </span>
  )
}

