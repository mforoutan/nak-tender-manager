import { DataTable } from "@/components/data-table";
import { TenderListItem } from "@/types";
import { cookies } from "next/headers";

async function getMyEvaluations(): Promise<TenderListItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const cookieStore = await cookies();

    const response = await fetch(
      `${baseUrl}/api/transaction-process/my-evaluations?limit=1000`,
      {
        headers: {
          'Cookie': cookieStore.toString(),
        },
        next: { revalidate: 300 } // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch evaluations:', response.statusText);
      return [];
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return [];
  }
}

export const metadata = {
    title: "ارزیابی های شرکت کرده | سامانه مناقصات و مزايدات ناك",
    description: "ارزیابی های شرکت کرده در سامانه مناقصات و مزايدات ناك",
};

export default async function ProcessEvaluationPage() {
    const evaluations = await getMyEvaluations();
    
    return (
        <section className="space-y-10">
            <h1 className="px-4 lg:px-6 font-medium text-xl">ارزیابی های شرکت کرده</h1>

            <DataTable
                data={evaluations}
                tabs={[]}
                itemsPerPage={10}
                showStatus={true}
                showStatusFilter={false}
            />
        </section>
    );
}
