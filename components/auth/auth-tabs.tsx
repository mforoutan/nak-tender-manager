"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLoginForm } from "@/components/auth/auth-login-form";
import { AuthRegisterForm } from "@/components/auth/auth-register-form";

export function AuthTabs() {
    const [activeTab, setActiveTab] = useState("login");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="register" className="w-full flex-col justify-start gap-6">
            <TabsList className="bg-[#EFEFEF] flex mx-auto **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1">
                <TabsTrigger className="text-lg font-normal py-1.5 px-3" value="register">ثبت‌نام</TabsTrigger>
                <TabsTrigger className="text-lg font-normal py-1.5 px-3" value="login">ورود</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="relative flex flex-col items-center gap-4 overflow-auto p-7 space-y-10 lg:mx-6 lg:p-12">
                <AuthLoginForm onSwitchToRegister={() => setActiveTab("register")} />
            </TabsContent>
            <TabsContent value="register" className="relative flex flex-col items-center gap-4 overflow-auto p-7 space-y-10 lg:mx-6 lg:p-12">
                <AuthRegisterForm />
            </TabsContent>
        </Tabs>
    );
}
