import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CountdownCard, DetailCard } from "./components";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "جزئیات فرآیند مناقصه | ناک",
    description: "صفحه جزئیات فرآیند مناقصه در سامانه ناک",
};

const detail = {
    title: "خرید تجهیزات اداری برای دفتر مرکزی",
    type: "مناقصه عمومی",
    publishedNumber: "۱۲-۵۹۹۲۸۳۴",
    guaranteeAmount: 2800000,
    documentFee: 500000,
    importantDates: [
        { label: "تاریخ شروع توزیع اسناد", value: "2025-09-15 17:00" },
        { label: "تاریخ پایان توزیع اسناد", value: "2025-10-05 17:00" },
        { label: "مهلت ارسال سوالات", value: "2025-12-12 17:00" },
        { label: "تاریخ پایان مناقصه", value: "2025-10-29 17:00" },
    ],
}

export default function PRDetailPage({ params }: { params: { slug: string } }) {
    return (
        <section className="space-y-12 px-4 lg:px-6  max-w-7xl">
            <div className="flex justify-between">

                <Breadcrumb className="text-base">
                    <BreadcrumbList className="items-center gap-x-1.5">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="font-medium">
                                داشبورد
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-xl">
                            |
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-xl">
                                جزئیات فرآیند مناقصه
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Button variant={`ghost`}>
                    <ArrowLeftIcon />
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-7">
                <DetailCard {...detail} />
                <CountdownCard targetDate={detail.importantDates[2].value} slug={params.slug} />
            </div>
        </section>
    );
}