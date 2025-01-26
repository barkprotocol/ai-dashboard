"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Settings, MessageSquare, BarChart, Zap, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/ui/logo"
import { Button } from "../ui/button"

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: Zap, label: "AI Trading", href: "/trading" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </Button>
      <Sidebar
        collapsible={isCollapsed ? "icon" : "none"}
        className={cn(
          "border-r bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarHeader className="p-4">
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                      pathname === item.href && "bg-gray-100 dark:bg-gray-700",
                    )}
                    aria-label={item.label}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    <span className={cn("transition-opacity", isCollapsed && "opacity-0")}>
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarTrigger onClick={() => setIsCollapsed(!isCollapsed)} className="w-full flex justify-center">
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </SidebarTrigger>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            v0.1.0-Beta
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
