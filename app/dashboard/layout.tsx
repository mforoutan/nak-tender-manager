import { AppSidebar } from "@/components/app-sidebar"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { DynamicIcon } from "lucide-react/dynamic"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "sonner"

export default function DashboardLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 32)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Alert className="mb-4 text-destructive">
                  <DynamicIcon name="circle-alert" />
                  <AlertTitle>فعال کردن حساب کاربری</AlertTitle>
                  <AlertDescription className="text-black">
                    <p>
                      تکمیل اطلاعات ستاره‌دار <b className="text-destructive">(*)</b> در فرم زیر برای شرکت در مناقصات، استعلام‌ها و فراخوان‌ها الزامی است. شرکت شما بر اساس این اطلاعات ابتدا توسط ناک ارزیابی و سپس به‌عنوان واجد شرایط برای شرکت در معاملات اعلام خواهد شد.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
              {children}
              {/* <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} /> */}
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster position="top-center" richColors />
    </SidebarProvider>
  )
}
