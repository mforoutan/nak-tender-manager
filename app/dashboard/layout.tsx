"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "sonner"
import React from "react"

export default function DashboardLayout({ children }: React.PropsWithChildren<{}>) {
  const [accountStatus, setAccountStatus] = useState<{
    hasTask: boolean;
    status: string | null;
  }>({
    hasTask: false,
    status: null
  });
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
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
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkAccountStatus();
  }, []);
  
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
              {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, { accountStatus, isCheckingStatus } as any);
                }
                return child;
              })}
            </div>
          </div>
        </div>
      </SidebarInset>
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
  )
}
