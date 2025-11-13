"use client";

import { useAlert } from '@/contexts/alert-context';
import { Button } from '@/components/ui/button';

/**
 * Example component demonstrating all alert system features
 * This is for documentation purposes only
 */
export function AlertExamples() {
  const { addAlert, clearAlerts } = useAlert();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">نمونه‌های Alert System</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Info Alert */}
        <Button
          variant="outline"
          onClick={() => addAlert({
            type: 'info',
            title: 'اطلاعیه',
            description: 'این یک پیام اطلاع‌رسانی است.',
            dismissible: true,
          })}
        >
          نمایش اطلاعیه
        </Button>

        {/* Success Alert */}
        <Button
          variant="outline"
          onClick={() => addAlert({
            type: 'success',
            title: 'عملیات موفق',
            description: 'اطلاعات با موفقیت ذخیره شد.',
            dismissible: true,
          })}
        >
          نمایش موفقیت
        </Button>

        {/* Warning Alert */}
        <Button
          variant="outline"
          onClick={() => addAlert({
            type: 'warning',
            title: 'هشدار',
            description: 'لطفا قبل از ادامه، اطلاعات را بررسی کنید.',
            dismissible: true,
          })}
        >
          نمایش هشدار
        </Button>

        {/* Error Alert */}
        <Button
          variant="outline"
          onClick={() => addAlert({
            type: 'error',
            title: 'خطا',
            description: 'متأسفانه خطایی رخ داده است.',
            dismissible: true,
          })}
        >
          نمایش خطا
        </Button>

        {/* Alert with Action */}
        <Button
          variant="outline"
          onClick={() => addAlert({
            type: 'error',
            title: 'خطا در بارگذاری',
            description: 'فایل انتخابی معتبر نیست.',
            action: {
              label: 'تلاش مجدد',
              onClick: () => alert('Retry clicked!'),
            },
            dismissible: true,
          })}
        >
          Alert با دکمه عملیات
        </Button>

        {/* Auto-dismiss Alert */}
        <Button
          variant="outline"
          onClick={() => addAlert({
            type: 'info',
            title: 'پیام موقت',
            description: 'این پیام پس از 3 ثانیه حذف می‌شود.',
            duration: 3000,
            dismissible: false,
          })}
        >
          Alert خودکار (3 ثانیه)
        </Button>

        {/* Non-dismissible Alert */}
        <Button
          variant="outline"
          onClick={() => addAlert({
            type: 'warning',
            title: 'هشدار مهم',
            description: 'این پیام دکمه بستن ندارد.',
            dismissible: false,
          })}
        >
          Alert بدون دکمه بستن
        </Button>

        {/* Clear All Alerts */}
        <Button
          variant="destructive"
          onClick={clearAlerts}
        >
          حذف تمام Alert‌ها
        </Button>
      </div>
    </div>
  );
}
