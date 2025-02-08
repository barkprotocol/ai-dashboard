"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import {
  BookOpen,
  Bookmark,
  Brain,
  HomeIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  User,
  MessageSquare,
  HelpCircle,
  LayoutDashboard,
  Layers,
  ClipboardList,
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

const ExploreItems = [
  {
    title: "MAIN",
    items: [
      {
        title: "Home",
        url: "https://ai.barkprotocol.net",
        segment: "home",
        icon: HomeIcon,
        external: true,
      },
    ],
  },
  {
    title: "DASHBOARD",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        segment: "dashboard",
        icon: LayoutDashboard,
        external: false,
      },
      {
        title: "Transactions",
        url: "/transactions",
        segment: "transactions",
        icon: ClipboardList,
        external: false,
      },
    ],
  },
  {
    title: "AI AGENTS",
    items: [
      {
        title: "Chat",
        url: "/chat",
        segment: "chat",
        icon: MessageSquare,
        external: false,
      },
      {
        title: "Memories",
        url: "/memories",
        segment: "memories",
        icon: Brain,
        external: false,
      },
      {
        title: "Saved Prompts",
        url: "/saved-prompts",
        segment: "saved-prompts",
        icon: Bookmark,
        external: false,
      },
    ],
  },
  {
    title: "DEFI",
    items: [
      {
        title: "Trading Assistant",
        url: "/trading-assistant",
        segment: "trading-assistant",
        icon: TrendingUp,
        external: false,
      },
      {
        title: "Integrations",
        url: "/integrations",
        segment: "integrations",
        icon: Layers,
        external: false,
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        title: "Account",
        url: "/account",
        segment: "account",
        icon: User,
        external: false,
      },
    ],
  },
  {
    title: "INFO",
    items: [
      {
        title: "FAQ",
        url: "/faq",
        segment: "faq",
        icon: HelpCircle,
        external: false,
      },
    ],
  },
  {
    title: "DOCUMENTATION",
    items: [
      {
        title: "Docs",
        url: "https://whitepaper.ai.barkprotocol.net",
        segment: "docs",
        icon: BookOpen,
        external: true,
      },
    ],
  },
] as const

export function AppSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const getIsActive = useMemo(
    () => (itemSegment: string) => {
      if (itemSegment === "home") {
        return pathname === "/home"
      }
      return pathname.startsWith(`/${itemSegment}`)
    },
    [pathname],
  )

  return (
    <Sidebar
      variant="sidebar"
      collapsible={isCollapsed ? "icon" : "none"}
      className="border-r w-64 md:w-72 lg:w-80 flex-shrink-0"
      aria-label="Main navigation"
    >
      <SidebarHeader className="flex flex-col items-start p-4 h-auto">
        <div className="flex items-center justify-between w-full mb-4">
          <Logo isScrolled={false} />
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-2">
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-[#D0C8B9]" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-[#D0C8B9]" />
            )}
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        {ExploreItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">{section.title}</h3>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={getIsActive(item.segment)}>
                    {item.external ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center py-2">
                        {item.icon && <item.icon className="mr-2 h-4 w-4 text-[#D0C8B9]" />}
                        {!isCollapsed && <span>{item.title}</span>}
                      </a>
                    ) : (
                      <Link href={item.url} className="flex items-center py-2">
                        {item.icon && <item.icon className="mr-2 h-4 w-4 text-[#D0C8B9]" />}
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <div>
              <span className="text-xs text-muted-foreground">Version 1.0.0</span>
            </div>
          )}
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

