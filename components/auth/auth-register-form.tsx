"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthRegisterForm() {
    return (
        <>
        <h1 className="text-center text-2xl font-bold"> به سیستم ثبت نام ناک خوش آمدید</h1>
        <Card className="w-sm p-12" dir="rtl">
            <CardContent className="p-0">
                <CardHeader className="sm:text-center">
                    <CardTitle>ثبت‌نام در ناک</CardTitle>
                </CardHeader>
                <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">محتوای ثبت‌نام به زودی اضافه می‌شود</p>
                </div>
            </CardContent>
        </Card>
        </>
    );
}
