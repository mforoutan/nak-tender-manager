"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "sonner"
import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertProvider } from "@/contexts/alert-context"
import { AlertContainer } from "@/components/alert-container"

export default function DashboardLayout({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const [companyStatus, setCompanyStatus] = useState<number | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status and get company status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (!response.ok) {
          toast.error('لطفا وارد حساب کاربری خود شوید');
          router.push('/auth');
          return;
        }
        
        const data = await response.json();
        setCompanyStatus(data.user.companyStatus);
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast.error('خطا در بررسی احراز هویت');
        router.push('/auth');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <AlertProvider>
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
                {React.Children.map(children, child => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child, { companyStatus } as any);
                  }
                  return child;
                })}
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
    </AlertProvider>
  )
}
