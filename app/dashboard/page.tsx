import { DataTable } from "@/components/dashboard/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"
import { YourDeals } from "@/components/dashboard/your-deals"
import { NewsEvents } from "@/components/dashboard/news-events"
import { CompanyStatusAlerts } from "@/components/dashboard/company-status-alerts"

import data from "./data.json"

export const metadata = {
  title: "داشبورد | ناک",
  description: "صفحه داشبورد کاربر در سامانه ناک",
};

interface DashboardPageProps {
  companyStatus?: number | null;
}

export default function DashboardPage({ companyStatus }: DashboardPageProps) {
  return (
    <section className="space-y-10">
      <CompanyStatusAlerts companyStatus={companyStatus} />
      
      <h1 className="px-4 lg:px-6 font-medium text-xl">داشبورد</h1>

      <SectionCards />
      <YourDeals />
      <DataTable data={data} itemsPerPage={4} />
      <NewsEvents />
    </section>
  )
}
