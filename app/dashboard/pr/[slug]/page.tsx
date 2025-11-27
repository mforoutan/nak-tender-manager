import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CountdownCard, DetailCard } from "./components";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { query } from "@/lib/db";
import { notFound } from "next/navigation";

export const metadata = {
    title: "جزئیات فرآیند مناقصه | ناک",
    description: "صفحه جزئیات فرآیند مناقصه در سامانه ناک",
};

async function getProcessDetails(slug: string) {
    try {
        const sql = `
            SELECT 
                pp.ID,
                pp.PUBLICATION_NUMBER,
                pp.TITLE,
                pp.DESCRIPTION,
                pp.STATUS,
                pp.PUBLISH_DATE,
                pp.DEADLINE_DATE,
                pp.SUBMISSION_START_DATE,
                pp.SUBMISSION_END_DATE,
                pp.ESTIMATED_VALUE,
                pp.CURRENCY,
                pp.DOCUMENT_PRICE,
                pp.DOCUMENT_CURRENCY,
                pp.PURCHASE_DEADLINE,
                tpt.TYPE_NAME as PROCESS_TYPE,
                tp.PROCESS_TYPE_ID
            FROM PUBLISHED_PROCESSES pp
            JOIN TRANSACTION_PROCESSES tp ON pp.TRANSACTION_PROCESSES_ID = tp.ID
            LEFT JOIN TRANSACTION_PROCESS_TYPES tpt ON tp.PROCESS_TYPE_ID = tpt.ID
            WHERE pp.PUBLICATION_NUMBER = :slug1
                AND pp.IS_ACTIVE = 1
        `;
        
        const result = await query(sql, [slug]);
        
        if (!result || result.length === 0) {
            return null;
        }
        
        return result[0];
    } catch (error) {
        console.error("Error fetching process details:", error);
        return null;
    }
}

export default async function PRDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const processDetails = await getProcessDetails(slug);
    
    if (!processDetails) {
        notFound();
    }
    
    const detail = {
        title: processDetails.TITLE || "بدون عنوان",
        type: processDetails.PROCESS_TYPE || "نامشخص",
        publishedNumber: processDetails.PUBLICATION_NUMBER,
        guaranteeAmount: processDetails.ESTIMATED_VALUE || 0,
        documentFee: processDetails.DOCUMENT_PRICE || 0,
        importantDates: [
            { 
                label: "تاریخ شروع توزیع اسناد", 
                value: processDetails.SUBMISSION_START_DATE || processDetails.PUBLISH_DATE 
            },
            { 
                label: "تاریخ پایان توزیع اسناد", 
                value: processDetails.PURCHASE_DEADLINE || processDetails.SUBMISSION_END_DATE 
            },
            { 
                label: "مهلت ارسال پیشنهادات", 
                value: processDetails.SUBMISSION_END_DATE 
            },
            { 
                label: "تاریخ پایان مناقصه", 
                value: processDetails.DEADLINE_DATE || processDetails.SUBMISSION_END_DATE 
            },
        ],
    };
    
    return (
        <section className="space-y-12 px-4 lg:px-6">
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
                                {detail.title}
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
                <CountdownCard targetDate={detail.importantDates[2].value} slug={detail.publishedNumber} />
            </div>
        </section>
    );
}