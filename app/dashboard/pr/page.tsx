import { DataTableServer } from "@/components/data-table";


export const metadata = {
  title: "معاملات موجود | ناک",
  description: "صفحه معاملات موجود در سامانه ناک",
};

export default async function AvailableTendersPage() {
  // const tenders = await getRecentTenders();
  return (
    <section className="space-y-10">
      <h1 className="px-4 lg:px-6 font-medium text-xl">معاملات موجود</h1>

      <DataTableServer
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
    </section>
  );
}