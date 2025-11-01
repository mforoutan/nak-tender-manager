import Image from "next/image";


import { ModeToggle } from "@/components/mode-toggle";
import { MainHeader } from "@/components/main-header";
import { AwardIcon, BellIcon, SearchCheckIcon } from "lucide-react";

import { toPersianNumbers } from "@/lib/utils";
import { DataTable } from "@/components/data-table";

import data from "@/app/dashboard/data.json"
import { NewsEvents } from "@/components/news-events";
import { MainFooter } from "@/components/main-footer";

function SectionCards() {
  let data = [
    {
      name: "مناقصات",
      icon: AwardIcon,
      color: "#FF4500",
      current: 120,
      upcoming: 45,
    },
    {
      name: "استعلام ها",
      icon: SearchCheckIcon,
      color: "#000000",
      current: 80,
      upcoming: 30,
    },
    {
      name: "فراخوان ها",
      icon: BellIcon,
      color: "#FFAB36",
      current: 60,
      upcoming: 25,
    },
  ];

  return (
    <div className="mx-auto flex justify-center gap-x-12">
      {data.map((section) => (
        <div className="py-6 px-16 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.07)]" key={section.name}>
          <div className="space-y-5">
            <div className="flex flex-col gap-y-5 items-center font-bold">
              <div className={`w-fit p-4 rounded-lg text-white shadow-lg`} style={{ backgroundColor: section.color }}>
                <section.icon size={24} />
              </div>
              <span>
                {section.name}
              </span>
            </div>
            <div className="flex gap-x-9 text-muted-foreground">
              <div className="flex items-baseline gap-x-1">
                <span className="text-sm">جاری:</span>
                <p className="text-xl">{toPersianNumbers(section.current.toString())}</p>
              </div>
              <div className="flex items-baseline gap-x-1">
                <span className="text-sm">آینده:</span>
                <p className="text-xl">{toPersianNumbers(section.upcoming.toString())}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <MainHeader />
      <main className="max-w-6xl mx-auto my-20 space-y-24">
        <SectionCards />
        <div className="space-y-10">
          <DataTable data={data} />
          <NewsEvents />
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
