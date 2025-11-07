import Image from "next/image";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthTabs } from "@/components/auth/auth-tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/auth/auth-form";

export const metadata = {
    title: "ورود و ثبت‌نام | ناک",
    description: "صفحه ورود و ثبت‌نام در سامانه ناک",
};

export default function AuthPage() {
    return (
        <div className="relative">
            <AuthHeader />
            <Image src={`/home/auth-bg.png`} alt="Auth Background" fill className="absolute -z-10 min-h-screen object-top object-cover" />
            <AuthForm />
        </div>
    );
}