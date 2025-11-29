import { DataTableServer } from "@/components/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Suspense } from "react";

export const metadata = {
    title: "فراخوان‌های شرکت کرده | سامانه مناقصات و مزايدات ناك",
    description: "فراخوان‌های شرکت کرده در سامانه مناقصات و مزايدات ناك",
};

export default async function MyCallsPage({
    searchParams,
}: {
    searchParams?: Promise<{
        search?: string
        status?: string
        date?: string
        page?: string
    }>
}) {
    const params = await searchParams;
    
    // Force type filter to "فراخوان"
    const filteredParams = {
        ...params,
        type: "فراخوان"
    };
    
    return (
        <section className="space-y-10">
            <h1 className="px-4 lg:px-6 font-medium text-xl">فراخوان‌های شرکت کرده</h1>

            <Suspense 
                key={JSON.stringify(filteredParams)} 
                fallback={
                    <DataTableSkeleton 
                        itemsPerPage={4} 
                        tabs={[]}
                        showStatusFilter={true}
                    />
                }
            >
                <DataTableServer
                    searchParams={filteredParams}
                    tabs={[]}
                    itemsPerPage={4}
                    showStatus={true}
                    showStatusFilter={true}
                    apiEndpoint="/api/transaction-process/submissions"
                />
            </Suspense>
        </section>
    );
}
