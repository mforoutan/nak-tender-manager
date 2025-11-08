import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/auth/login-dialog";


function MainHeader() {
    return (
        <div className="relative">
            <div className=" bg-gradient-to-r from-[#FBA149] to-[#C13558] absolute inset-x-0 -z-9 h-4" >
                <div className="relative w-full h-full bg-[url(/noise.png)] mix-blend-soft-light" />
            </div>
            <div className="absolute inset-x-0 mx-auto w-full max-w-5xl px-4 z-20">
                <header dir="ltr" className="flex items-center justify-between py-8">
                    <div>
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="NAK"
                                width={100}
                                height={70}
                            />
                        </Link>
                    </div>
                    <div className="flex items-center gap-x-8 text-sm">
                        <nav dir="rtl" className="flex gap-x-8 text-white">
                            <Link href="/">صفحه اصلی</Link>
                            <Link href="/terms">قوانین و مقررات</Link>
                            <Link href="/faq" className="hidden lg:inline">پرسش‌های متداول</Link>
                            <Link href="/en" className="hidden lg:inline">تغییر زبان به EN</Link>
                        </nav>
                        <div className="hidden lg:flex gap-x-4">
                            <Link href="/auth" className="block">
                                <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 shadow-icon">
                                    ثبت نام
                                </Button>
                            </Link>
                            <LoginDialog />
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
}

export { MainHeader };