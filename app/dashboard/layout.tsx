"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "sonner"

export default function DashboardLayout({ children }: React.PropsWithChildren<{}>) {
  // State for alert visibility and account status
  const [showAccountAlert, setShowAccountAlert] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  // Check account verification status on mount
  useEffect(() => {
    const checkAccountStatus = async () => {
      try {
        const response = await fetch('/api/tasks/status?contractorId=301');
        if (response.ok) {
          const data = await response.json();
          
          // Show alert if no task exists or if task is rejected
          if (!data.hasTask || data.task?.status === 'REJECTED') {
            setShowAccountAlert(true);
          } else if (data.task?.status === 'PENDING' || data.task?.status === 'IN_PROGRESS') {
            // Don't show alert if account is under review
            setShowAccountAlert(false);
          } else if (data.task?.status === 'COMPLETED') {
            // Don't show alert if account is verified
            setShowAccountAlert(false);
          }
        } else {
          // If API fails, show alert to be safe
          setShowAccountAlert(true);
        }
      } catch (error) {
        console.error('Error checking account status:', error);
        // Show alert on error
        setShowAccountAlert(true);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkAccountStatus();
  }, []);
  
  // Function to handle action button click
  const handleAlertAction = () => {
    // Navigate to account page
    window.location.href = "/dashboard/account";
  };
  
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
                
                {!isCheckingStatus && showAccountAlert && (
                  <Alert className="mb-4 text-destructive relative">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>فعال کردن حساب کاربری</AlertTitle>
                    <AlertDescription className="text-black">
                      <p>
                        تکمیل اطلاعات ستاره‌دار <b className="text-destructive">(*)</b> در فرم زیر برای شرکت در مناقصات، استعلام‌ها و فراخوان‌ها الزامی است. شرکت شما بر اساس این اطلاعات ابتدا توسط ناک ارزیابی و سپس به‌عنوان واجد شرایط برای شرکت در معاملات اعلام خواهد شد.
                      </p>
                      <div className="mt-3">
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={handleAlertAction}
                        >
                          تکمیل اطلاعات
                        </Button>
                      </div>
                    </AlertDescription>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute left-2 top-2 h-6 w-6 text-gray-500 hover:text-gray-900"
                      onClick={() => setShowAccountAlert(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </Alert>
                )}
              </div>
              {children}
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
