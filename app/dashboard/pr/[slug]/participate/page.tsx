import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import ParticipateClient from "./participate-client";
import { query } from "@/lib/db";

export const metadata = {
    title: "شرکت در مناقصه | ناک",
    description: "صفحه شرکت در مناقصه در سامانه ناک",
};

// Fetch process details and required documents
async function getProcessData(slug: string) {
    try {
        // Get process details including type - query by publication number
        const processSql = `
            SELECT 
                tp.ID,
                tp.PROCESS_TYPE_ID,
                tpt.TYPE_NAME
            FROM PUBLISHED_PROCESSES pp
            JOIN TRANSACTION_PROCESSES tp ON pp.TRANSACTION_PROCESSES_ID = tp.ID
            LEFT JOIN TRANSACTION_PROCESS_TYPES tpt ON tp.PROCESS_TYPE_ID = tpt.ID
            WHERE pp.PUBLICATION_NUMBER = :processId1
        `;
        const processResult = await query(processSql, [slug]);
        
        if (!processResult || processResult.length === 0) {
            return null;
        }
        
        const process = processResult[0];
        
        // Get required documents for this process type
        const documentsSql = `
            SELECT 
                ID,
                DOC_NAME,
                SUBMISSION_TYPE,
                IS_MANDATORY
            FROM REQUIRED_PROCESS_DOCUMENTS
            WHERE PROCESS_TYPE_ID = :processTypeId1
            ORDER BY ID
        `;
        const documentsResult = await query(documentsSql, [process.PROCESS_TYPE_ID]);
        
        return {
            processId: process.ID,
            processType: process.TYPE_NAME,
            requiredDocuments: documentsResult.map((doc: any) => ({
                id: doc.ID,
                docName: doc.DOC_NAME,
                submissionType: doc.SUBMISSION_TYPE,
                isMandatory: doc.IS_MANDATORY === 1
            }))
        };
    } catch (error) {
        console.error("Error fetching process data:", error);
        return null;
    }
}

export default async function ParticipatePRPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const processData = await getProcessData(slug);
    
    // Mock data for development if database fetch fails
    const mockData = {
        processId: slug,
        processType: "مناقصه عمومی",
        requiredDocuments: [
            { id: 1, docName: "مستندات پاکت الف", submissionType: "BOTH", isMandatory: true },
            { id: 2, docName: "مستندات پاکت ب", submissionType: "BOTH", isMandatory: true },
            { id: 3, docName: "مستندات پاکت پ", submissionType: "BOTH", isMandatory: false },
        ]
    };
    
    const data = processData || mockData;
    
    return(
       <section className="space-y-12 px-4 lg:px-6 max-w-7xl">
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
                            <BreadcrumbLink href={`/dashboard/pr/${slug}`} className="font-medium">
                                جزئیات فرآیند مناقصه
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
                processId={data.processId}
                processType={data.processType}
                requiredDocuments={data.requiredDocuments}
            />
        </section>
    );
}