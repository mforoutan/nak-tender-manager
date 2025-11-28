"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconUser,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronDown, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { useSession } from "@/hooks/use-session"
import { cn } from "@/lib/utils"

export function NavUser({
  buttonClassName,
  ...props
}: React.ComponentProps<typeof SidebarMenu> & {
  buttonClassName?: string
}) {
  // const { isMobile } = useSidebar()
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user } = useSession();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('خروج با موفقیت انجام شد');
        router.push('/auth');
      } else {
        toast.error('خطا در خروج از سیستم');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('خطا در برقراری ارتباط با سرور');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null; // or a loading skeleton
  }

  const displayName = `${user.firstName} ${user.lastName}`.trim() || user.username;
  const displayCompanyName = user.companyName;

  return (
    <SidebarMenu {...props}>
      <SidebarMenuItem className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                buttonClassName
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-full bg-black text-white">
                  <User className="size-5" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                {/* <span className="text-muted-foreground truncate text-xs">
                  {displayCompanyName}
                </span> */}
              </div>
              <ChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            // side={isMobile ? "bottom" : "right"}
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel dir="rtl" className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-right text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-full bg-black text-white">
                    <User className="size-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {displayCompanyName}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem dir="rtl" onClick={handleLogout} disabled={isLoggingOut}>
              <IconLogout />
              {isLoggingOut ? 'در حال خروج...' : 'خروج'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
