import { DataTable } from "@/components/data-table";
import { TenderListItem } from "@/types";
import { cookies } from "next/headers";

async function getWonContracts(): Promise<TenderListItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const cookieStore = await cookies();

    const response = await fetch(
      `${baseUrl}/api/transaction-process/winners?limit=1000`,
      {
        headers: {
          'Cookie': cookieStore.toString(),
        },
        next: { revalidate: 300 } // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch won contracts:', response.statusText);
      return [];
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching won contracts:', error);
    return [];
  }
}

export const metadata = {
    title: "قراردادها | سامانه مناقصات و مزايدات ناك",
    description: "قراردادها در سامانه مناقصات و مزايدات ناك",
};

export default async function WonContractsPage() {
    const contracts = await getWonContracts();
    
    return (
        <section className="space-y-10">
            <h1 className="px-4 lg:px-6 font-medium text-xl">قراردادها</h1>

            <DataTable
                data={contracts}
                tabs={[]}
                itemsPerPage={10}
                serverSide={true}
                showStatus={true}
                showStatusFilter={false}
            />
        </section>
    );
}
