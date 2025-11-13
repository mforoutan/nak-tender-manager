"use client";

import { CardContent } from "@/components/ui/card";
import { CheckCircle2, PartyPopper } from "lucide-react";

export function CompletedStep() {
    return (
        <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="relative mb-6">
                    <div className="p-6 bg-green-100 rounded-full">
                        <CheckCircle2 className="h-16 w-16 text-green-600" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                        <PartyPopper className="h-8 w-8 text-amber-500" />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-center mb-3 text-green-600">
                    حساب فعال شد!
                </h3>

                <p className="text-center text-muted-foreground max-w-md mb-6">
                    اطلاعات شما تأیید شده و حساب کاربری شما فعال است. اکنون می‌توانید در معاملات شرکت کنید.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md w-full">
                    <p className="text-sm text-green-800 text-center">
                        برای شروع، به بخش معاملات موجود مراجعه کنید و در مناقصات و استعلام‌ها شرکت نمایید.
                    </p>
                </div>
            </div>
        </CardContent>
    );
}
