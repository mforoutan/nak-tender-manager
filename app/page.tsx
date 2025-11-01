import Image from "next/image";


import { ModeToggle } from "@/components/mode-toggle";
import { MainHeader } from "@/components/main-header";
import { DataTable } from "@/components/data-table";

import data from "@/app/dashboard/data.json"
import { NewsEvents } from "@/components/news-events";
import { MainFooter } from "@/components/main-footer";

export default function Home() {
  return (
    <div>
      <MainHeader />
      <main className="max-w-6xl mx-auto my-20 space-y-24">
        <div className="space-y-10">
          <DataTable data={data} showStatusFilter={false} showStatus={false} />
          <NewsEvents />
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
