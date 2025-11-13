"use client";

import { useEffect } from "react";
import { useAlert } from "@/contexts/alert-context";
import { useRouter } from "next/navigation";

interface CompanyStatusAlertsProps {
  companyStatus: number | null | undefined;
}

export function CompanyStatusAlerts({ companyStatus }: CompanyStatusAlertsProps) {
  const { addAlert } = useAlert();
  const router = useRouter();

  // Company status values from COMPANY_STATUSES table:
  // 1 = 'در انتظار تایید' (Pending Approval)
  // 2 = 'تایید شده' (Approved)
  // 3 = 'رد شده' (Rejected)
  // 4 = 'معلق' (Suspended)
  // 5 = 'غیرفعال' (Inactive)
  // 6 = 'در حال بررسی مدارک' (Under Document Review)

  useEffect(() => {
    if (companyStatus === null || companyStatus === undefined) return;

    switch (companyStatus) {
      case 1: // Pending
        addAlert({
          type: 'warning',
          title: 'در انتظار تایید',
          description: 'حساب کاربری شما در انتظار تایید مدیر است.',
          action: {
            label: 'مشاهده وضعیت',
            onClick: () => router.push('/dashboard/account'),
          },
          dismissible: true,
        });
        break;

      case 2: // Approved
        addAlert({
          type: 'success',
          title: 'حساب فعال',
          description: 'حساب کاربری شما تأیید شده است و می‌توانید از تمامی امکانات استفاده کنید.',
          dismissible: true,
        });
        break;

      case 3: // Rejected
        addAlert({
          type: 'error',
          title: 'نیاز به اصلاح',
          description: 'حساب کاربری شما رد شده است. اطلاعات ارسالی نیاز به اصلاح دارد.',
          action: {
            label: 'اصلاح اطلاعات',
            onClick: () => router.push('/dashboard/account'),
          },
          dismissible: true,
        });
        break;

      case 4: // Suspended
        addAlert({
          type: 'error',
          title: 'حساب معلق',
          description: 'حساب کاربری شما به صورت موقت تعلیق شده است.',
          dismissible: true,
        });
        break;

      case 5: // Inactive
        addAlert({
          type: 'error',
          title: 'حساب غیرفعال',
          description: 'حساب کاربری شما غیرفعال شده است.',
          dismissible: true,
        });
        break;

      case 6: // Under Review
        addAlert({
          type: 'info',
          title: 'در حال بررسی مدارک',
          description: 'مدارک شما در حال بررسی توسط کارشناسان است. نتیجه از طریق ایمیل اطلاع‌رسانی خواهد شد.',
          dismissible: true,
        });
        break;
    }
  }, [companyStatus, addAlert, router]);

  return null; // This component only handles side effects
}
