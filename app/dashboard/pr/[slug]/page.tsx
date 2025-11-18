import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DetailCard } from "./components";

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
        { label: "مهلت ارسال سوالات", value: "2025-10-10 17:00" },
        { label: "تاریخ پایان مناقصه", value: "2025-10-29 17:00" },
    ],
}

export default function PRDetailPage() {
    return (
        <section className="space-y-12 px-4 lg:px-6 ">
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

            <div className="flex gap-x-8">
                <DetailCard {...detail} />
            </div>
        </section>
    );
}