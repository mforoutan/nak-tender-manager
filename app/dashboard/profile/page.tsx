"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfilePageProps {
  accountStatus?: {
    hasTask: boolean;
    status: string | null;
  };
  isCheckingStatus?: boolean;
}

export default function ProfilePage({ accountStatus, isCheckingStatus }: ProfilePageProps) {
  const showAlert = !isCheckingStatus && accountStatus && (!accountStatus.hasTask || accountStatus.status === 'REJECTED');

  return (
    <>
      <h1 className="px-4 lg:px-6 font-medium text-xl">اطلاعات تکمیلی</h1>
      
      {showAlert && (
        <div className="px-4 lg:px-6">
          <Alert className="text-amber-700 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>تکمیل اطلاعات حساب کاربری</AlertTitle>
            <AlertDescription>
              <p className="mb-3">
                ابتدا باید اطلاعات حساب کاربری خود را تکمیل کنید.
              </p>
              <Button 
                size="sm" 
                variant="default"
                onClick={() => window.location.href = "/dashboard/account"}
              >
                تکمیل اطلاعات
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}
