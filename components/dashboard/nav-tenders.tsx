"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { ChevronLeft } from "lucide-react"
import { toPersianNumbers } from "@/lib/utils"

export function NavTenders({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: IconName
    items?: {
      title: string
      url: string
      icon?: IconName
      count: number
    }[]
  }[]
}) {
  const { isMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel className="text-lg font-semibold px-8 py-2.5 text-white">معاملات</SidebarGroupLabel>

        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              item.items?.some((sub) => pathname === sub.url)

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {item.items && item.items.length > 0 ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} isActive={isActive} className="sidebar-links-colors sidebar-links-p">
                          {item.icon && <DynamicIcon name={item.icon} />}
                          <span>{item.title}</span>
                          <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-r-0 mx-0 px-0 gap-y-4 py-4">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                                className="sidebar-links-colors sidebar-links-p"
                              >
                                <Link href={subItem.url}>
                                  {subItem.icon && <DynamicIcon name={subItem.icon} />}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                                <SidebarMenuBadge className="top-1.5 left-4 right-[unset] w-fit text-xs font-semibold text-white">{toPersianNumbers(subItem.count)}</SidebarMenuBadge>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      isActive={pathname === item.url}
                      className="sidebar-links-colors sidebar-links-p"
                    >
                      <Link href={item.url}>
                        {item.icon && <DynamicIcon name={item.icon} />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
