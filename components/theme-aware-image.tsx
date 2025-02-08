"use client"

import type { ImageProps } from "next/image"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface ThemeAwareImageProps extends Omit<ImageProps, "src" | "className"> {
  lightSrc: ImageProps["src"]
  darkSrc: ImageProps["src"]
  className?: string
  width: number
  height: number
}

export function ThemeAwareImage({
  lightSrc,
  darkSrc,
  alt,
  className = "",
  width,
  height,
  ...props
}: ThemeAwareImageProps) {
  return (
    <>
      <Image
        src={lightSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn("dark:hidden", className)}
        {...props}
      />
      <Image
        src={darkSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn("hidden dark:block", className)}
        {...props}
      />
    </>
  )
}

