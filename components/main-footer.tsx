import { MailIcon, MapPinIcon, PhoneIcon, PrinterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function LinkedInIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.66406 9.16699V13.3337M6.66406 6.66699V6.67533M9.9974 13.3337V9.16699M13.3307 13.3337V10.8337C13.3307 10.3916 13.1551 9.96771 12.8426 9.65515C12.53 9.34259 12.1061 9.16699 11.6641 9.16699C11.222 9.16699 10.7981 9.34259 10.4856 9.65515C10.173 9.96771 9.9974 10.3916 9.9974 10.8337" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.5 5.83333C2.5 4.94928 2.85119 4.10143 3.47631 3.47631C4.10143 2.85119 4.94928 2.5 5.83333 2.5H14.1667C15.0507 2.5 15.8986 2.85119 16.5237 3.47631C17.1488 4.10143 17.5 4.94928 17.5 5.83333V14.1667C17.5 15.0507 17.1488 15.8986 16.5237 16.5237C15.8986 17.1488 15.0507 17.5 14.1667 17.5H5.83333C4.94928 17.5 4.10143 17.1488 3.47631 16.5237C2.85119 15.8986 2.5 15.0507 2.5 14.1667V5.83333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function InstagramIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.33594 6.66634C3.33594 5.78229 3.68713 4.93444 4.31225 4.30932C4.93737 3.6842 5.78522 3.33301 6.66927 3.33301H13.3359C14.22 3.33301 15.0678 3.6842 15.693 4.30932C16.3181 4.93444 16.6693 5.78229 16.6693 6.66634V13.333C16.6693 14.2171 16.3181 15.0649 15.693 15.69C15.0678 16.3152 14.22 16.6663 13.3359 16.6663H6.66927C5.78522 16.6663 4.93737 16.3152 4.31225 15.69C3.68713 15.0649 3.33594 14.2171 3.33594 13.333V6.66634Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.75 6.25V6.25833M7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function TelegramIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 8.33301L9.16667 11.6663L14.1667 16.6663L17.5 3.33301L2.5 9.16634L5.83333 10.833L7.5 15.833L10 12.4997" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const data = {
    navSocials: [
        {
            href: "https://www.linkedin.com",
            label: "LinkedIn",
            icon: LinkedInIcon
        },
        {
            href: "https://www.instagram.com",
            label: "Instagram",
            icon: InstagramIcon
        },
        {
            href: "https://www.telegram.org",
            label: "Telegram",
            icon: TelegramIcon
        }
    ],
    navLinks: [
        {
            href: "#",
            label: "پرتال شرکت مخابرات"
        },
        {
            href: "#",
            label: "همراه من"
        },
        {
            href: "#",
            label: "ایران تلکام"
        }
    ],
    navRelatedLinks: [
        {
            href: "#",
            label: "همراه اول"
        },
        {
            href: "#",
            label: "مخابرات ایران"
        },
        {
            href: "#",
            label: "ایران تلکام"
        }
    ],
    navContactUs: [
        {
            icon: PhoneIcon,
            label: "تلفن:",
            value: "٠٢١٨١٧١٧٨٢٨"
        },
        {
            icon: PrinterIcon,
            label: "فکس:",
            value: "٠٢١٨١٧١٧٨٢٩"
        },
        {
            icon: MailIcon,
            label: "ایمیل:",
            value: "info@example.com"
        },
        {
            icon: MapPinIcon,
            label: "آدرس:",
            value: "تهران، ميدان ونک، خيابان ملاصدرا، خيابان پرديس، نبش كوچه زاينده رود، پلاک ٢"
        }
    ]
};

function MainFooter() {
    return (
        <footer dir="ltr" className="flex flex-col lg:flex-row gap-y-10 justify-between px-8 py-16 lg:px-24 lg:py-16 bg-[#111827]">
            <div dir="rtl" className="flex flex-col gap-y-12 text-white">
                <Link href={`/`} aria-label="Home">
                    <Image src="/logo-white.png" alt="Logo" width={150} height={50} />
                </Link>
                <div>
                    <nav>
                        <ul className="flex gap-x-4">
                            {data.navSocials.map((item, index) => (
                                <li key={index} className="bg-[#1F2937] p-2.5 rounded-full">
                                    <Link href={item.href} aria-label={item.label} target="_blank" rel="noopener noreferrer">
                                        <item.icon className="h-6 w-6" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            <div dir="rtl">
                <h4 className="text-white font-bold mb-4">پیوند ها</h4>
                <nav>
                    <ul className="space-y-2 text-[#D1D5DB]">
                        {data.navLinks.map((item, index) => (
                            <li key={index}>
                                <Link href={item.href} className="hover:underline">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div dir="rtl">
                <h4 className="text-white font-bold mb-4">لینک‌های مرتبط</h4>
                <nav>
                    <ul className="space-y-2 text-[#D1D5DB]">
                        {data.navRelatedLinks.map((item, index) => (
                            <li key={index}>
                                <Link href={item.href} className="hover:underline">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div dir="rtl" className="lg:basis-86">
                <h4 className="text-white font-bold mb-4">ارتباط با ما</h4>
                <div className="text-white">
                    <ul className="[&_li]:flex [&_li]:items-start [&_li]:gap-x-2 [&_li]:mb-3 [&_li_svg]:text-primary [&_li_svg]:min-w-6 text-[#D1D5DB]">
                        {data.navContactUs.map((item, index) => (
                            <li key={index}>
                                <item.icon />
                                <span>
                                    {item.label}
                                </span>
                                <span>
                                    {item.value}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export { MainFooter };