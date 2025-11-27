import { DataTable } from "@/components/data-table";
import { TenderListItem } from "@/types";

async function getRecentTenders(): Promise<TenderListItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/published-processes?status=ongoing&limit=1000`,
      {
        next: { revalidate: 300 } // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch tenders:', response.statusText);
      return [];
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching recent tenders:', error);
    return [];
  }
}

export const metadata = {
    title: "معاملات موجود | ناک",
    description: "صفحه معاملات موجود در سامانه ناک",
};

export default async function AvailableTendersPage() {
    const tenders = await getRecentTenders();
    return (
    <section className="space-y-10">
      <h1 className="px-4 lg:px-6 font-medium text-xl">معاملات موجود</h1>

        <DataTable
        data={tenders}
        tabs={[
          { value: "all", label: "همه" },
          { value: "tender", label: "مناقصه", typeFilter: "مناقصه عمومی" },
          { value: "inquiry", label: "استعلام", typeFilter: "استعلام" },
          { value: "call", label: "فراخوان", typeFilter: "فراخوان" },
        ]}
        itemsPerPage={4}
        serverSide={true}
        showStatus={false}
      />
    </section>
    );
}