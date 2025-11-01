import Image from "next/image";
import Link from "next/link";
import { AwardIcon, BellIcon, SearchCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/login-dialog";

import { toPersianNumbers } from "@/lib/utils";

function SectionCards() {
    let data = [
        {
            name: "مناقصات",
            icon: AwardIcon,
            color: "#FF4500",
            current: 120,
            upcoming: 45,
        },
        {
            name: "استعلام ها",
            icon: SearchCheckIcon,
            color: "#000000",
            current: 80,
            upcoming: 30,
        },
        {
            name: "فراخوان ها",
            icon: BellIcon,
            color: "#FFAB36",
            current: 60,
            upcoming: 25,
        },
    ];

    return (
        <div className="mx-auto max-w-full flex flex-col lg:flex-row justify-center gap-x-12 gap-y-3">
            {data.map((section) => (
                <div className="bg-white py-6 px-16 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.07)]" key={section.name}>
                    <div className="space-y-5">
                        <div className="flex flex-col gap-y-5 items-center font-bold">
                            <div className={`w-fit p-4 rounded-lg text-white shadow-lg`} style={{ backgroundColor: section.color }}>
                                <section.icon size={24} />
                            </div>
                            <span>
                                {section.name}
                            </span>
                        </div>
                        <div className="flex gap-x-9 text-muted-foreground">
                            <div className="flex items-baseline gap-x-1">
                                <span className="text-sm">جاری:</span>
                                <p className="text-xl">{toPersianNumbers(section.current.toString())}</p>
                            </div>
                            <div className="flex items-baseline gap-x-1">
                                <span className="text-sm">آینده:</span>
                                <p className="text-xl">{toPersianNumbers(section.upcoming.toString())}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function MainHeader() {
    return (
        <div className="relative">
            <div className="block lg:hidden bg-gradient-to-r from-[#FBA149] to-[#C13558] absolute inset-x-0 -z-9 h-4" >
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
                            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 shadow-lg">
                                ثبت نام
                            </Button>
                            <LoginDialog />
                        </div>
                    </div>
                </header>
            </div>
            <div className="w-screen relative">
                <Image
                    src="/home/hero.gif"
                    alt="Hero"
                    width={1920}
                    height={1000}
                    objectFit="cover"
                    className="hidden lg:block pointer-events-none select-none w-screen max-h-[900px] -z-10"
                    unoptimized
                />
                <div className="sr-only">
                    <h2>
                                به سامانه معاملات ناک خوش آمدید
                            </h2>
                            <p>
                                لطفا برای شرکت در مناقصات، مزایدات و ارزیابی ها، به سامانه وارد شوید.
                            </p>
                </div>
                <Image
                    src="/home/hero-bg.png"
                    alt="Hero Mobile"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="right"
                    className="block lg:hidden pointer-events-none select-none -z-10"
                />
                <div className="h-full flex flex-col justify-end pt-52 pb-20 lg:py-20">
                    <div className="flex lg:hidden flex-col items-center text-center px-4 space-y-6">

                        <Image
                            src="/home/hero-mobile.png"
                            alt="Hero Overlay"
                            width={1000}
                            height={1000}
                            objectFit="contain"
                            className="relative -left-2 pointer-events-none select-none -mb-8"
                        />
                        <div className="flex flex-col gap-y-6 text-white">
                            <h2 className="font-bold text-4xl">
                                به سامانه معاملات ناک
                                <br />
                                خوش آمدید
                            </h2>
                            <p className="font-semibold text-xs">
                                لطفا برای شرکت در مناقصات، مزایدات و ارزیابی ها، به سامانه وارد شوید.
                            </p>
                        </div>
                        <div className="flex lg:hidden gap-x-4 mb-28">
                            <LoginDialog buttonSize="lg" />
                            <Button size={`lg`} variant="secondary" className="bg-white/20 text-white hover:bg-white/30 shadow-lg">
                                ثبت نام
                            </Button>
                        </div>
                    </div>
                    <SectionCards />
                </div>
            </div>
        </div>
    );
}

export { MainHeader };