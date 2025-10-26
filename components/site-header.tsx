
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { NavUser } from "@/components/nav-user";
import Image from "next/image";
import { DynamicIcon } from "lucide-react/dynamic";

const data = {
  user: {
    name: "محمد فروتن",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }
};

export function SiteHeader() {
  return (
    <header className="space-y-3">
      <div className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-mr-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div>
            <NavUser user={data.user} />
          </div>
          <div className="mr-auto flex items-center gap-2">
            
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
        </div>
      </div>
    </header>
  )
}
