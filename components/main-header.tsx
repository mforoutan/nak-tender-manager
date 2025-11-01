import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

function MainHeader() {
    return (
        <div className="relative">
            <div className="absolute inset-x-0 mx-auto w-full max-w-5xl">
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
                        <h1 className="sr-only">NAK</h1>
                    </div>
                    <div className="flex items-center gap-x-8 text-sm">
                        <nav dir="rtl" className="flex gap-x-8 text-white">
                            <Link href="/">صفحه اصلی</Link>
                            <Link href="/terms">قوانین و مقررات</Link>
                            <Link href="/faq">پرسش‌های متداول</Link>
                            <Link href="/en">تغییر زبان به EN</Link>
                        </nav>
                        <div className="flex gap-x-4">
                            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 shadow-lg">
                                ثبت نام
                            </Button>
                            <Button variant="default" className="bg-white text-black hover:bg-white/90 shadow-lg">
                                ورود
                            </Button>
                        </div>
                    </div>
                </header>
            </div>
            <div className="w-screen h-[900px] relative -z-10">
                <Image
                    src="/hero.gif"
                    alt="Hero"
                    layout="fill"
                    objectFit="cover"
                    className="pointer-events-none select-none h-auto"
                />
            </div>
        </div>
    );
}

export { MainHeader };