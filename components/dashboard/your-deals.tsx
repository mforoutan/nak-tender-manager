import { Empty, EmptyTitle } from "../ui/empty";
import { DataTableServer, DataTableSkeleton, type DataTableServerProps } from "../data-table";
import { Suspense } from "react";

function YourDeals(params: DataTableServerProps) {

    return (
        <div className="space-y-6">
            <h3 className="px-6 ">
                معاملات شما
            </h3>
            <Suspense
                key={JSON.stringify(params)}
                fallback={
                    <DataTableSkeleton
                        itemsPerPage={1}
                        tabs={[]}
                        showStatusFilter={true}
                    />
                }
            >
                <DataTableServer
                    searchParams={params['searchParams']}
                    tabs={[]}
                    itemsPerPage={1}
                    showStatus={false}
                    showStatusFilter={false}
                    apiEndpoint="/api/transaction-process/submissions"
                />
            </Suspense>
        </div>
    );
}

export { YourDeals };