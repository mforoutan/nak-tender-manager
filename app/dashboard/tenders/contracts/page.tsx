import { DataTableServer } from "@/components/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Suspense } from "react";

export const metadata = {
    title: "قراردادها | سامانه مناقصات و مزايدات ناك",
    description: "قراردادها در سامانه مناقصات و مزايدات ناك",
};

export default async function ProccessWinnersPage({
    searchParams,
}: {
    searchParams?: Promise<{
        search?: string
        status?: string
        type?: string
        date?: string
        page?: string
    }>
}) {
    const params = await searchParams
    
    return (
        <section className="space-y-10">
            <h1 className="px-4 lg:px-6 font-medium text-xl">قراردادها</h1>

            <Suspense 
                key={JSON.stringify(params)} 
                fallback={
                    <DataTableSkeleton 
                        itemsPerPage={4} 
                        tabs={[]}
                        showStatusFilter={false}
                    />
                }
            >
                <DataTableServer
                        searchParams={params}
                        tabs={[]}
                        itemsPerPage={4}
                        showStatus={true}
                        showStatusFilter={false}
                        apiEndpoint="/api/transaction-process/winners"
                    />
            </Suspense>
        </section>
    );
}
