import { AccountContent } from "@/components/account-content"

export default function AccountPage() {
  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto">
        <AccountContent />
      </div>
    </div>
  )
}

