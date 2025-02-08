import type React from "react"
import { cn } from "@/lib/utils"

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children, className, ...props }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-primary hover:underline", className)}
      {...props}
    >
      {children}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

export default ExternalLink

