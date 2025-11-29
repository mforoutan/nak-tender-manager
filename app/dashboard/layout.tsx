"use client";

import { Toaster } from "sonner"
import React from "react"
import { AlertProvider } from "@/contexts/alert-context"
import { SessionProvider } from "@/contexts/session-context"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { AlertContainer } from "@/components/alert-container"

function DashboardContent({ children }: React.PropsWithChildren) {

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 32)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" className="bg-[#131A22] py-18" />
      <SidebarInset className="bg-[url(/bg.svg)] bg-no-repeat bg-bottom">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
      <AlertContainer />
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            fontFamily: 'Vazirmatn, sans-serif',
            fontSize: '0.925rem',
            direction: 'rtl',
            textAlign: 'right'
          },
        }}
      />
    </SidebarProvider>
  );
}

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <AlertProvider>
      <SessionProvider>
        <DashboardContent>{children}</DashboardContent>
      </SessionProvider>
    </AlertProvider>
  )
}
