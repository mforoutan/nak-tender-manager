import { DataTable } from '@/components/dashboard/data-table';
import type { TenderListItem } from '@/types';

async function getPublishedProcesses(): Promise<TenderListItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/published-processes?status=all&limit=100`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch published processes');
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching published processes:', error);
    return [];
  }
}

export default async function TendersPage() {
  const tenders = await getPublishedProcesses();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">مناقصات و فراخوان‌ها</h1>
      <DataTable
        data={tenders}
        itemsPerPage={10}
        tabs={[
          { value: "all", label: "همه" },
          { value: "tender", label: "مناقصه", typeFilter: "مناقصه عمومی" },
          { value: "inquiry", label: "استعلام", typeFilter: "استعلام بها" },
          { value: "call", label: "فراخوان", typeFilter: "فراخوان" },
        ]}
        showStatusFilter={true}
        showStatus={true}
      />
    </div>
  );
}
