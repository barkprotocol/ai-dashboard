import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  isScrolled: boolean
}

export function Logo({ isScrolled }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", isScrolled ? "text-foreground" : "text-primary")}>
      <Image
        src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
        alt="BARK AI Logo"
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-none">BARK</span>
        <span className="text-xs font-medium tracking-wider">AI AGENT</span>
      </div>
    </Link>
  )
}

