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
      url: "#",
      icon: "layout-dashboard",
    },
    {
      title: "حساب کاربری",
      url: "#",
      icon: "badge-check",
    },
    {
      title: "اطلاعات تکمیلی",
      url: "#",
      icon: "file-user",
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navTenders: [
    {
      title: "معاملات شما",
      url: "#",
      icon: "handshake",
      items: [
        {
      title: "معاملات من",
      url: "#",
      icon: "camera",
    },
      ]
    },
    {
      title: "وضعیت ارزیابی‌ها",
      url: "#",
      icon: "scan-search",
    },
    {
      title: "قراردادها",
      url: "#",
      icon: "sticker",
    },
    {
      title: "معاملات موجود",
      url: "#",
      icon: "list",
    },
  ],
  
  navSecondary: [
    {
      title: "راهنمای شرکت در معامله",
      url: "#",
      icon: "lightbulb",
    },
    {
      title: "پشتیبانی",
      url: "#",
      icon: "headset",
    },
    {
      title: "تنظیمات",
      url: "#",
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
