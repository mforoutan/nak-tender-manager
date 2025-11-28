"use client"

import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSession } from "@/hooks/use-session"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: IconName
  }[]
}) {
  const pathname = usePathname()
  const { accountTask } = useSession()

  const getAccountBadge = () => {
    if (!accountTask) return null;

    if (accountTask.status === 'COMPLETED') {
      return {
        text: 'فعال',
        className: 'text-[#34C759] bg-[#34C759]/20'
      };
    }

    if (!accountTask.hasTask || accountTask.status === 'REJECTED') {
      return {
        text: 'غیرفعال',
        className: 'text-destructive bg-destructive/15'
      };
    }

    if (accountTask.status === 'PENDING' || accountTask.status === 'IN_PROGRESS') {
      return {
        text: 'در انتظار تایید',
        className: 'text-[#7E7E7E] bg-[#7E7E7E]/10'
      };
    }

    return null;
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel className='text-lg font-semibold px-8 py-2.5 text-white'>اطلاعات کاربری</SidebarGroupLabel>

        <SidebarMenu>
          {items.map((item) => {
            const isAccountPage = item.url === "/dashboard/account";
            const badge = isAccountPage ? getAccountBadge() : null;
            const isDashboardHome = item.url === "/dashboard";
            const isActive = isDashboardHome 
              ? pathname === "/dashboard" 
              : pathname.includes(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                  className='sidebar-links-colors sidebar-links-p'
                >
                  <Link href={item.url} className='flex justify-between'>
                      {item.icon && <DynamicIcon name={item.icon} />}
                      <span className='flex-1 text-right'>{item.title}</span>
                    {badge && (
                      <SidebarMenuBadge
                        className={`left-4 right-[unset] w-fit rounded-md px-2 py-1 text-xs ${badge.className}`}
                      >
                        {badge.text}
                      </SidebarMenuBadge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
