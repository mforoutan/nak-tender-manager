import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import ParticipateClient from "./participate-client";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const metadata = {
    title: "شرکت در مناقصه | ناک",
    description: "صفحه شرکت در مناقصه در سامانه ناک",
};

// Fetch process details and required documents from API
async function getProcessData(slug: string) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(
            `${baseUrl}/api/participate/process-data?publicationNumber=${slug}`,
            {
                headers: {
                    'Cookie': sessionCookie ? `session=${sessionCookie.value}` : '',
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            console.error("API error:", await response.text());
            return null;
        }

        const result = await response.json();
        
        if (!result.success) {
            return null;
        }

        return {
            processId: result.data.processId,
            processType: result.data.processType,
            publicationNumber: result.data.publicationNumber,
            proccessTitle: result.data.title,
            requiredDocuments: result.data.requiredDocuments,
            documentPrice: result.data.documentPrice,
        };
    } catch (error) {
        console.error("Error fetching process data:", error);
        return null;
    }
}

export default async function ParticipatePRPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const processData = await getProcessData(slug);
    
    if (!processData) {
        notFound();
    }
    
    return(
       <section className="space-y-12 px-0 lg:px-6">
            <div className="flex justify-between px-4 lg:px-0">
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
                            <BreadcrumbLink href={`/dashboard/pr/${slug}`} className="font-medium">
                                {processData.proccessTitle}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-xl">
                            |
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-xl">
                                شرکت در مناقصه
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Button variant="ghost" asChild>
                    <a href={`/dashboard/pr/${slug}`}>
                        <ArrowLeftIcon />
                    </a>
                </Button>
            </div>

            <ParticipateClient 
                processId={processData.processId}
                processType={processData.processType}
                publicationNumber={processData.publicationNumber}
                proccessTitle={processData.proccessTitle}
                requiredDocuments={processData.requiredDocuments}
                documentPrice={processData.documentPrice}
            />
        </section>
    );
}