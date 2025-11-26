"use client"

import * as React from "react"
import Image from "next/image"

import {
  IconCamera,
  IconFileAi,
  IconFileDescription,
} from "@tabler/icons-react"

import { type IconName } from 'lucide-react/dynamic';

import { NavTenders } from "@/components/dashboard/nav-tenders"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
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
      icon: "layout-dashboard" as IconName,
    },
    {
      title: "حساب کاربری",
      url: "/dashboard/account",
      icon: "badge-check" as IconName,
    },
    {
      title: "اطلاعات تکمیلی",
      url: "/dashboard/profile",
      icon: "file-user" as IconName,
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
      url: "#",
      icon: "handshake" as IconName,
      items: [
        {
          title: "مناقصه",
          url: "/dashboard/tenders/list",
          icon: "award" as IconName,
          count: 0,
        },
        {
          title: "استعلام‌ها",
          url: "/dashboard/tenders/inquiries",
          icon: "search-check" as IconName,
          count: 5,
        },
        {
          title: "فراخوان‌ها",
          url: "/dashboard/tenders/calls",
          icon: "megaphone" as IconName,
          count: 20,
        },
      ]
    },
    {
      title: "وضعیت ارزیابی‌ها",
      url: "/dashboard/tenders/evaluations",
      icon: "scan-search" as IconName,
    },
    {
      title: "قراردادها",
      url: "/dashboard/tenders/contracts",
      icon: "sticker" as IconName,
    },
    {
      title: "معاملات موجود",
      url: "/dashboard/tenders/available",
      icon: "list" as IconName,
    },
  ],

  navSecondary: [
    {
      title: "راهنمای شرکت در معامله",
      url: "/dashboard/help",
      icon: "lightbulb" as IconName,
    },
    {
      title: "پشتیبانی",
      url: "/dashboard/support",
      icon: "headset" as IconName,
    },
    {
      title: "تنظیمات",
      url: "/dashboard/settings",
      icon: "settings" as IconName,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" side="right" {...props} >
      <SidebarHeader className="block lg:hidden sidebar-links-p">
        <NavUser
          className="group h-auto rounded-md group-has-data-[state=open]:bg-white/10 data-[sidebar=menu-item]:w-full **:text-white hover:bg-white/10"
          buttonClassName="hover:bg-transparent data-[state=open]:bg-white/10"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTenders items={data.navTenders} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <img src={'/nak-sidebar-bg.svg'} className="absolute left-4 top-160 lg:top-190 size-60 object-contain object-no-repeat mix-blend-color-dodge" />
    </Sidebar>
  )
}
