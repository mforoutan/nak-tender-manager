"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconLayoutDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconCircleCheck,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { BadgeCheck, FileUser, LayoutDashboard } from "lucide-react"
import { IconName } from "lucide-react/dynamic"


import { NavTenders } from "@/components/nav-tenders"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "داشبورد",
      url: "/dashboard",
      icon: "layout-dashboard",
    },
    {
      title: "حساب کاربری",
      url: "/dashboard/account",
      icon: "badge-check",
    },
    {
      title: "اطلاعات تکمیلی",
      url: "/dashboard/profile",
      icon: "file-user",
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "/dashboard/capture",
      items: [
        {
          title: "Active Proposals",
          url: "/dashboard/capture/active",
        },
        {
          title: "Archived",
          url: "/dashboard/capture/archived",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "/dashboard/proposal",
      items: [
        {
          title: "Active Proposals",
          url: "/dashboard/proposal/active",
        },
        {
          title: "Archived",
          url: "/dashboard/proposal/archived",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "/dashboard/prompts",
      items: [
        {
          title: "Active Proposals",
          url: "/dashboard/prompts/active",
        },
        {
          title: "Archived",
          url: "/dashboard/prompts/archived",
        },
      ],
    },
  ],
  navTenders: [
    {
      title: "معاملات شما",
      url: "/dashboard/tenders/my",
      icon: "handshake",
      items: [
        {
          title: "معاملات من",
          url: "/dashboard/tenders/my/list",
          icon: "camera",
        },
      ]
    },
    {
      title: "وضعیت ارزیابی‌ها",
      url: "/dashboard/tenders/evaluations",
      icon: "scan-search",
    },
    {
      title: "قراردادها",
      url: "/dashboard/tenders/contracts",
      icon: "sticker",
    },
    {
      title: "معاملات موجود",
      url: "/dashboard/tenders/available",
      icon: "list",
    },
  ],
  
  navSecondary: [
    {
      title: "راهنمای شرکت در معامله",
      url: "/dashboard/help",
      icon: "lightbulb",
    },
    {
      title: "پشتیبانی",
      url: "/dashboard/support",
      icon: "headset",
    },
    {
      title: "تنظیمات",
      url: "/dashboard/settings",
      icon: "settings",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" side="right" {...props}>
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTenders items={data.navTenders} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
