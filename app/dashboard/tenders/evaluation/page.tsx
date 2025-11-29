import { DataTable, DataTableServer } from "@/components/data-table";
import { TenderListItem } from "@/types";
import { cookies } from "next/headers";



export const metadata = {
    title: "ارزیابی های شرکت کرده | سامانه مناقصات و مزايدات ناك",
    description: "ارزیابی های شرکت کرده در سامانه مناقصات و مزايدات ناك",
};

export default async function ProcessEvaluationPage() {
    
    return (
        <section className="space-y-10">
            <h1 className="px-4 lg:px-6 font-medium text-xl">ارزیابی های شرکت کرده</h1>

            <DataTableServer
                    tabs={[]}
                    itemsPerPage={4}
                    showStatus={true}
                    showStatusFilter={false}
                    apiEndpoint="/api/transaction-process/my-evaluations"
                  />
        </section>
    );
}
