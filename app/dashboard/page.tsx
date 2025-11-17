import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"
import { YourDeals } from "@/components/dashboard/your-deals"
import { NewsEvents } from "@/components/dashboard/news-events"
import { CompanyStatusAlerts } from "@/components/dashboard/company-status-alerts"
import type { TenderListItem } from "@/types"

export const metadata = {
  title: "داشبورد | ناک",
  description: "صفحه داشبورد کاربر در سامانه ناک",
};

interface DashboardPageProps {
  companyStatus?: number | null;
}

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

export default async function DashboardPage({ companyStatus }: DashboardPageProps) {
  const tenders = await getRecentTenders();
  
  return (
    <section className="space-y-10">
      <CompanyStatusAlerts companyStatus={companyStatus} />
      
      <h1 className="px-4 lg:px-6 font-medium text-xl">داشبورد</h1>

      <SectionCards />
      <YourDeals />
      <DataTable 
        data={tenders}
        itemsPerPage={4}
        serverSide={false}
      />
      <NewsEvents />
    </section>
  )
}
