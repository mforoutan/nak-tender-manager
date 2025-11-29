import { DataTableServer } from "@/components/data-table";

export const metadata = {
    title: "قراردادها | سامانه مناقصات و مزايدات ناك",
    description: "قراردادها در سامانه مناقصات و مزايدات ناك",
};

export default async function ProccessWinnersPage() {
    
    return (
        <section className="space-y-10">
            <h1 className="px-4 lg:px-6 font-medium text-xl">قراردادها</h1>

            <DataTableServer
                    tabs={[]}
                    itemsPerPage={4}
                    showStatus={true}
                    showStatusFilter={false}
                    apiEndpoint="/api/transaction-process/winners"
                  />
        </section>
    );
}
