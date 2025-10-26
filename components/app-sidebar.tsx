"use client"

import * as React from "react"
import Image from "next/image"

import {
  IconCamera,
  IconFileAi,
  IconFileDescription,
} from "@tabler/icons-react"


import { NavTenders } from "@/components/nav-tenders"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"

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
    <Sidebar collapsible="offcanvas" side="right" {...props} className="bg-[url('../public/nav.svg')] bg-center bg-no-repeat">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
            <NavUser user={data.user} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTenders items={data.navTenders} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
      </SidebarFooter> */}
      {/* <div className="absolute inset-0">
      <Image src="/nak.svg" width={100} height={100} alt="NAK" className="mx-auto mb-4" />
      </div> */}
    </Sidebar>
  )
}
