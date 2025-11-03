import Image from "next/image";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthTabs } from "@/components/auth/auth-tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "ورود و ثبت‌نام | ناک",
    description: "صفحه ورود و ثبت‌نام در سامانه ناک",
};

export default function AuthPage() {
    return (
        <div className="relative">
            <AuthHeader />
            <Image src={`/home/auth-bg.png`} alt="Auth Background" fill className="absolute -z-10 min-h-screen object-top object-cover" />
            <main className="pt-48 mx-auto max-w-5xl text-center">
                <AuthTabs />
                <Link href={`/`}> 
                    <Button variant={`outline`} className="bg-transparent font-semibold">بازگشت به صفحه اصلی</Button>
                </Link>
            </main>
        </div>
    );
}