import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { TabConfig } from "./types"

interface DataTableSkeletonProps {
  itemsPerPage?: number
  tabs?: TabConfig[]
  showStatusFilter?: boolean
}

function DataCardSkeleton() {
  return (
    <Card className="overflow-hidden pl-14 pr-14 py-6 lg:pr-22 relative gap-1">
      {/* Icon skeleton - only visible on large screens */}
      <div className="absolute inset-y-0 right-0 hidden lg:flex items-center pr-6">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      
      <CardHeader className="px-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 justify-between">
            <div className="flex flex-col lg:flex-row flex-1 gap-2">
              {/* Title skeleton */}
              <Skeleton className="h-5 w-[300px] lg:w-[400px]" />
              
              {/* Badges skeleton */}
              <div className="flex gap-2 order-first lg:order-last">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex gap-4 px-0">
        {/* Category skeleton */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        {/* Date skeleton */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[200px] lg:w-[350px]" />
        </div>
      </CardContent>
    </Card>
  )
}

export function DataTableSkeleton({ 
  itemsPerPage = 10,
  tabs = [
    { value: "all", label: "همه" },
    { value: "tender", label: "مناقصه", typeFilter: "مناقصه عمومی" },
    { value: "inquiry", label: "استعلام", typeFilter: "استعلام" },
    { value: "call", label: "فراخوان", typeFilter: "فراخوان" },
    { value: "evaluation", label: "ارزیابی", typeFilter: "ارزیابی" },
  ],
  showStatusFilter = true,
}: DataTableSkeletonProps) {
  return (
    <Tabs
      dir="rtl"
      defaultValue={tabs[0]?.value || "all"}
      className="w-full flex-col justify-start gap-6"
    >
      {/* Header with tabs and search */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="bg-transparent flex mx-auto gap-[18px] lg:mx-0">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} disabled className="text-lg">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="hidden lg:flex items-center gap-2">
          <Skeleton className="h-10 w-32 rounded" />
          <Skeleton className="h-10 w-64 rounded" />
        </div>
      </div>

      {/* Content area */}
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="relative flex flex-col gap-4 overflow-auto mx-4 p-7 space-y-10 lg:mx-6 lg:p-12 bg-[#F6F6F6] rounded-lg"
        >
          {/* Status filter skeleton */}
          {showStatusFilter && (
            <div className="flex justify-center lg:justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-36 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
              <div className="hidden lg:block">
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          )}

          {/* Mobile search skeleton */}
          <div className="flex lg:hidden items-center justify-between gap-2">
            <Skeleton className="h-10 w-24 rounded" />
            <Skeleton className="h-10 w-64 rounded" />
          </div>

          {/* Data cards skeleton */}
          <div className="flex flex-col gap-4">
            {[...Array(itemsPerPage)].map((_, i) => (
              <DataCardSkeleton key={i} />
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-end px-4">
            <div className={`flex w-full items-center gap-8 ${showStatusFilter ? "lg:w-fit" : ""}`}>
              <div className={`${showStatusFilter ? "flex lg:hidden" : "flex"} flex-1 justify-start`}>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded border" />
                <Skeleton className="h-10 w-10 rounded border" />
                <Skeleton className="h-10 w-10 rounded border" />
                <Skeleton className="h-10 w-10 rounded border" />
              </div>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
