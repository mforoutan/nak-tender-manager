"use client"

import * as React from "react"
import { useSession } from "@/hooks/use-session"

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

const getNavData = (participation: { tenderCount: number; inquiryCount: number; callCount: number }) => {

  return {
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
    navTenders: [
      {
        title: "معاملات شما",
        url: "#",
        icon: "handshake" as IconName,
        items: [
          {
            title: "مناقصه",
            url: "/dashboard/tp/my/tenders",
            icon: "award" as IconName,
            count: participation.tenderCount,
          },
          {
            title: "استعلام‌ها",
            url: "/dashboard/tp/my/inquiries",
            icon: "search-check" as IconName,
            count: participation.inquiryCount,
          },
          {
            title: "فراخوان‌ها",
            url: "/dashboard/tp/my/calls",
            icon: "megaphone" as IconName,
            count: participation.callCount,
          },
        ]
      },
      {
        title: "وضعیت ارزیابی‌ها",
        url: "/dashboard/tp/my/evaluations",
        icon: "scan-search" as IconName,
      },
      {
        title: "قراردادها",
        url: "/dashboard/tp/my/contracts",
        icon: "sticker" as IconName,
      },
      {
        title: "معاملات موجود",
        url: "/dashboard/tp/available",
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
        title: "تماس با ما",
        url: "/dashboard/contact",
        icon: "headset" as IconName,
      },
      {
        title: "تنظیمات",
        url: "/dashboard/settings",
        icon: "settings" as IconName,
      },
    ],
  };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { processParticipation } = useSession();

  const participation = processParticipation || {
    tenderCount: 0,
    inquiryCount: 0,
    callCount: 0,
  };

  const data = getNavData(participation);

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
