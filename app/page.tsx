import { MainHeader } from "@/components/main-header";
import { DataTable } from "@/components/dashboard/data-table";

import data from "@/app/dashboard/data.json"
import { NewsEvents } from "@/components/dashboard/news-events";
import { MainFooter } from "@/components/main-footer";
import { MainHero } from "@/components/main-hero";


export const metadata = {
  title: "صفحه اصلی | ناک",
  description: "به سامانه معاملات ناک خوش آمدید",
};

export default function Home() {
  return (
    <div>
      <MainHeader />
      <MainHero />
      <main className="max-w-6xl mx-auto my-20 space-y-24">
        <div className="space-y-10">
          <div className="space-y-12">
            <h3 className="font-medium text-lg px-4 lg:px-6">معاملات موجود</h3>
            <DataTable data={data} showStatusFilter={false} showStatus={false} itemsPerPage={4} />
          </div>
          <NewsEvents />
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
