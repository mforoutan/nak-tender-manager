import { DataTableServer } from "@/components/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Suspense } from "react";


export const metadata = {
  title: "معاملات موجود | ناک",
  description: "صفحه معاملات موجود در سامانه ناک",
};

export default async function AvailableTendersPage({
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
      <h1 className="px-4 lg:px-6 font-medium text-xl">معاملات موجود</h1>

      <Suspense 
        key={JSON.stringify(params)} 
        fallback={
          <DataTableSkeleton 
            itemsPerPage={4} 
            tabs={[
              { value: "all", label: "همه" },
              { value: "tender", label: "مناقصه", typeFilter: "مناقصه عمومی" },
              { value: "inquiry", label: "استعلام", typeFilter: "استعلام" },
              { value: "call", label: "فراخوان", typeFilter: "فراخوان" },
            ]}
            showStatusFilter={true}
          />
        }
      >
        <DataTableServer
          searchParams={params}
          tabs={[
            { value: "all", label: "همه" },
            { value: "tender", label: "مناقصه", typeFilter: "مناقصه عمومی" },
            { value: "inquiry", label: "استعلام", typeFilter: "استعلام" },
            { value: "call", label: "فراخوان", typeFilter: "فراخوان" },
          ]}
          itemsPerPage={4}
          showStatus={false}
          showStatusFilter={true}
          apiEndpoint="/api/transaction-process/published"
        />
      </Suspense>
    </section>
  );
}