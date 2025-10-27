"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskStatusDialog } from "@/components/task-status-dialog"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"

interface DashboardPageProps {
  accountStatus?: {
    hasTask: boolean;
    status: string | null;
  };
  isCheckingStatus?: boolean;
}

export default function DashboardPage({ accountStatus, isCheckingStatus }: DashboardPageProps) {
  const showAlert = !isCheckingStatus && !accountStatus?.hasTask || accountStatus?.status === 'REJECTED';
  const isUnderReview = !isCheckingStatus && accountStatus && (accountStatus.status === 'PENDING' || accountStatus.status === 'IN_PROGRESS');
  const isVerified = !isCheckingStatus && accountStatus && accountStatus.status === 'COMPLETED';

  return (
    <>
      <h1 className="px-4 lg:px-6 font-medium text-xl">داشبورد</h1>
      
      <div className="px-4 lg:px-6">
        {showAlert && (
          <Alert className="text-red-700 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>حساب کاربری غیرفعال</AlertTitle>
            <AlertDescription>
              <p className="mb-3">
                {accountStatus?.status === 'REJECTED' 
                  ? 'حساب کاربری شما غیرفعال است. اطلاعات ارسالی نیاز به اصلاح دارد.'
                  : 'حساب کاربری شما غیرفعال است. برای فعال‌سازی، لطفاً اطلاعات خود را تکمیل کنید.'}
              </p>
              <Button 
                size="sm" 
                variant="default"
                onClick={() => window.location.href = "/dashboard/account"}
              >
                {accountStatus?.status === 'REJECTED' ? 'اصلاح اطلاعات' : 'تکمیل اطلاعات'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isUnderReview && (
          <Alert className="text-blue-700 bg-blue-50 border-blue-200">
            <Clock className="h-4 w-4" />
            <AlertTitle>در حال بررسی</AlertTitle>
            <AlertDescription>
              اطلاعات شما در حال بررسی توسط کارشناسان است. نتیجه از طریق ایمیل اطلاع‌رسانی خواهد شد.
            </AlertDescription>
          </Alert>
        )}

        {isVerified && (
          <Alert className="text-green-700 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>حساب فعال</AlertTitle>
            <AlertDescription>
              حساب کاربری شما تأیید شده است و می‌توانید از تمامی امکانات استفاده کنید.
            </AlertDescription>
          </Alert>
        )}
      </div>

      
      {/* <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div> */}
      <DataTable data={data} itemsPerPage={4} />
    </>
  )
}
