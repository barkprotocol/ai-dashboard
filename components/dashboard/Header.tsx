"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WalletButton } from "../ui/wallet-button"

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp" alt="@bark_protocol" />
          <AvatarFallback>BP</AvatarFallback>
        </Avatar>
        <span className="font-medium hidden sm:inline">User Name</span>
      </div>
      <WalletButton />
    </header>
  )
}

