"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WalletButton } from "./WalletButton"

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="font-medium hidden sm:inline">User Name</span>
      </div>
      <WalletButton />
    </header>
  )
}

