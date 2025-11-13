"use client";

import { CardContent } from "@/components/ui/card";
import { ClipboardCheck, Clock } from "lucide-react";

export function ReviewStep() {
    return (
        <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="relative mb-6">
                    <div className="p-6 bg-blue-100 rounded-full">
                        <ClipboardCheck className="h-16 w-16 text-blue-600" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2 bg-amber-100 rounded-full">
                        <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-center mb-3">
                    در حال بررسی
                </h3>

                <p className="text-center text-muted-foreground max-w-md mb-6">
                    اطلاعات شما در حال بررسی توسط کارشناسان است. پس از تأیید، حساب کاربری شما فعال خواهد شد.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md w-full">
                    <p className="text-sm text-blue-800 text-center">
                        در صورت نیاز به اصلاحات، از طریق پیامک و ایمیل به شما اطلاع‌رسانی خواهد شد.
                    </p>
                </div>
            </div>
        </CardContent>
    );
}
