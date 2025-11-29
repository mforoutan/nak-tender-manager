import { MainHeader } from "@/components/main-header";
import { DataTable, DataTableServer, DataTableSkeleton } from "@/components/data-table";
import type { TenderListItem } from "@/types"

import { NewsEvents } from "@/components/dashboard/news-events";
import { MainFooter } from "@/components/main-footer";
import { MainHero } from "@/components/main-hero";
import { Suspense } from "react";


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
            <Suspense 
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
          </div>
          <NewsEvents />
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
