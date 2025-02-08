import type React from "react"
import { useRef, useEffect } from "react"

const ChatScrollAnchor: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return <div ref={ref} />
}

export default ChatScrollAnchor

