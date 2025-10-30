"use client"

import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
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
  const [accountStatus, setAccountStatus] = useState<{
    hasTask: boolean;
    status: string | null;
  } | null>(null);

  useEffect(() => {
    const checkAccountStatus = async () => {
      try {
        const response = await fetch('/api/tasks/status?contractorId=301');
        if (response.ok) {
          const data = await response.json();
          setAccountStatus({
            hasTask: data.hasTask,
            status: data.task?.status || null
          });
        }
      } catch (error) {
        console.error('Error checking account status:', error);
      }
    };

    checkAccountStatus();
  }, []);

  const needsAttention = accountStatus &&
    (!accountStatus.hasTask || accountStatus.status === 'REJECTED');

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>اطلاعات کاربری</SidebarGroupLabel>

        <SidebarMenu>
          {items.map((item) => {
            const isAccountPage = item.url === "/dashboard/account";
            const showBadge = isAccountPage && needsAttention;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={pathname === item.url}
                >
                  <Link href={item.url} className='flex justify-between'>
                      {item.icon && <DynamicIcon name={item.icon} />}
                      <span className='flex-1 text-right'>{item.title}</span>
                    {showBadge && (
                      <Badge
                        className="rounded-md text-xs bg-red-500/5 text-red-500 hover:bg-red-500/5"
                      >
                        غیر فعال
                      </Badge>
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
