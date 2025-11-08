"use client"

import * as React from "react"
import { AwardIcon, MilestoneIcon, Calendar1Icon, Search, SearchCheckIcon, GavelIcon, StickerIcon, Clock, MegaphoneIcon } from "lucide-react"

import { z } from "zod"

import { toPersianNumbers } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link"
import { PersianDatePicker } from "@/components/ui/persian-date-picker"
import { tr } from "date-fns/locale"

export const schema = z.object({
  id: z.number(),
  title: z.string(),
  type: z.string(),
  status: z.string(),
  endDate: z.string(),
  category: z.string(),
  code: z.string(),
})


export type TabConfig = {
  value: string
  label: string
  typeFilter?: string
}

// Helper function to convert Gregorian date to Persian calendar
function toPersianDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function CardIcon({ type, status }: { type: string, status: string }) {
  if (type === "قرارداد") {
    return (
      <div className="bg-[#FF00DD] text-white rounded-full p-3">
        <StickerIcon />
      </div>
    )
  }
  if (type === "ارزیابی") {
    return (
      <div className="bg-[#0088FF] text-white rounded-full p-3">
        <Clock />
      </div>
    )
  }
  if (type === "فراخوان") {
    return (
      <div className="bg-[#FFF4F0] text-primary rounded-full p-3">
        <MegaphoneIcon />
      </div>
    )
  }
  if (type === "استعلام") {
    return (
      <div className="bg-[#FFF4F0] text-primary rounded-full p-3">
        <SearchCheckIcon />
      </div>
    )
  }
  if (type === "مزایده") {
    return (
      <div className="bg-[#FFF4F0] text-primary rounded-full p-3">
        <GavelIcon />
      </div>
    )
  }

  return (
    <div className="bg-[#FFF4F0] text-primary rounded-full p-3">
      <AwardIcon />
    </div>
  )
}

function StatusBadge({ status, type }: { status: string, type: string }) {
  if (type === "ارزیابی") {
    return (
      <div className="flex items-center gap-1">
        <Badge variant="outline" className={`bg-[#0088FF] text-white rounded-full px-2`}>
          {status}
        </Badge>
      </div>
    );
  }
  if (status === "واجد شرایط" || status === "جاری") {
    return (
      <div className="flex items-center gap-1">
        <Badge variant="outline" className={`bg-[#0088FF] text-white rounded-full px-2`}>
          {status}
        </Badge>
      </div>
    );
  }
  if (status === "منعقد") {
    return (
      <div className="flex items-center gap-1">
        <Badge variant="outline" className={`bg-[#FF00DD] text-white rounded-full px-2`}>
          {status}
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Badge variant="outline" className={`bg-gray-500 text-white rounded-full px-2`}>
        {status}
      </Badge>
    </div>
  );
}

function DataCard({ item, showStatus = false }: { item: z.infer<typeof schema>, showStatus: boolean }) {
  return (
    <Card className="overflow-hidden pl-14 pr-14  py-6 lg:pr-22 relative gap-1 hover:bg-[#FFF4F0]">
      <div className="absolute inset-y-0 right-0 hidden lg:flex items-center pr-6">
        <CardIcon type={item.type} status={item.status} />
      </div>
      <CardHeader className="px-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 justify-between">
            <div className="flex flex-col lg:flex-row flex-1 gap-2">
              <Link href={`/tenders/${item.id}`} className="text-sm font-bold">
                <h3 className="inline">
                  {item.title}
                </h3>
              </Link>
              <div className="flex gap-2 order-first lg:order-last">
                <Badge variant="outline" className={`${item.type in ["مناقصه", "استعلام", "فراخوان"] ? 'text-primary border-[#FFDED0] bg-[#FFF4F0]' : 'text-black border border-[#E4E4E7] bg-transparent'} rounded-md px-2`}>
                  {item.type}
                </Badge>
                <Badge variant="outline" className="text-black rounded-md px-2">
                  {toPersianNumbers(item.code)}
                </Badge>
              </div>
            </div>
            {showStatus && (
              <StatusBadge status={item.status} type={item.type} />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex gap-4 px-0">
        <div className="flex items-center gap-1 text-sm text-neutral-800">
          <MilestoneIcon size={14} />
          <span>{item.category}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-neutral-800">
          <Calendar1Icon size={14} />
          <span className="hidden lg:inline">پایان مهلت تحویل اسناد و شرکت در معامله تا</span>
          <span className="font-bold">{toPersianDate(item.endDate)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function DataTable({
  data: initialData,
  itemsPerPage = 10,
  tabs = [
    { value: "all", label: "همه" },
    { value: "tender", label: "مناقصه", typeFilter: "مناقصه عمومی" },
    { value: "inquiry", label: "استعلام", typeFilter: "استعلام" },
    { value: "call", label: "فراخوان", typeFilter: "فراخوان" },
    { value: "evaluation", label: "ارزیابی", typeFilter: "ارزیابی" },
  ],
  showStatusFilter = true,
  showStatus = true,
}: {
  data: z.infer<typeof schema>[]
  itemsPerPage?: number
  tabs?: TabConfig[],
  showStatusFilter?: boolean,
  showStatus?: boolean
}) {
  const [data, setData] = React.useState(() => initialData)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDate, setSelectedDate] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ongoing")
  const [typeFilter, setTypeFilter] = React.useState<string>(tabs[0]?.value || "all")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: itemsPerPage,
  })

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchQuery === "" ||
        item.title.includes(searchQuery) ||
        item.code.includes(searchQuery) ||
        item.category.includes(searchQuery)

      const matchesDate = selectedDate === "" || item.endDate === selectedDate
      const matchesStatus = item.status === statusFilter

      // Find the current tab configuration
      const currentTab = tabs.find(tab => tab.value === typeFilter)
      const matchesType = !currentTab?.typeFilter || item.type === currentTab.typeFilter

      return matchesSearch && matchesDate && matchesStatus && matchesType
    })
  }, [data, searchQuery, selectedDate, statusFilter, typeFilter, tabs])

  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredData.slice(start, end)
  }, [filteredData, pagination])

  // Reset pagination when filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [searchQuery, selectedDate, statusFilter, typeFilter])

  const pageCount = Math.ceil(filteredData.length / pagination.pageSize)
  const canPreviousPage = pagination.pageIndex > 0
  const canNextPage = pagination.pageIndex < pageCount - 1

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const currentPage = pagination.pageIndex + 1

    if (pageCount <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(pageCount - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < pageCount - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      pages.push(pageCount)
    }

    return pages
  }

  return (
    <Tabs
      dir="rtl"
      defaultValue={tabs[0]?.value || "all"}
      value={typeFilter}
      onValueChange={setTypeFilter}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="bg-transparent flex mx-auto gap-[18px] lg:mx-0 **:data-[slot=tabs-trigger]:rounded-lg **:data-[slot=tabs-trigger]:px-xs **:data-[slot=tabs-trigger]:py-1.5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:shadow-sm flex font-semibold box-content text-lg text-muted-foreground leading-7">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="hidden lg:flex items-center gap-2">
          <PersianDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="تاریخ"
            className="w-auto gap-x-2 min-h-input-sm rounded-input px-sm py-2.5"
          />
          <InputGroup className="w-64" size="lg">
            <InputGroupInput
              placeholder="جستجو در معاملات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-0 leading-7 h-7"
            />
            <InputGroupAddon className="pl-2 py-0">
              <Search className="size-4" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="relative flex flex-col gap-4 overflow-auto mx-4 p-7 space-y-10 lg:mx-6 lg:p-12 bg-[#F6F6F6] rounded-lg"
        >
          {showStatusFilter && (
            <div className="flex justify-center lg:justify-between">
              <Tabs value={statusFilter} onValueChange={setStatusFilter} dir="rtl">
                <TabsList className="bg-white mx-auto lg:mx-0">
                  <TabsTrigger className="data-[state=active]:bg-black" value="ongoing">در حال برگزاری</TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-black" value="upcoming">در انتظار برگزاری</TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-black" value="completed">برگزارشده</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="text-primary hidden flex-1 lg:flex justify-end">
                {toPersianNumbers(filteredData.length.toString())} معامله
              </div>
            </div>
          )}
          <div className="flex lg:hidden items-center justify-between gap-2">
            <PersianDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="تاریخ"
              className="w-auto"
            />
            <InputGroup className="w-64 bg-white">
              <InputGroupInput
                placeholder="جستجو در معاملات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon className="pr-3 pl-1">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="flex flex-col gap-4">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <DataCard key={item.id} item={item} showStatus={showStatus} />
              ))
            ) : (
              <div className="col-span-full flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">نتیجه‌ای یافت نشد.</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end px-4">
            <div className={`flex w-full items-center gap-8 ${showStatusFilter ? "lg:w-fit" : ""}`}>
              <div className={`text-primary flex-1 ${showStatusFilter ? "flex lg:hidden" : "flex"} justify-start`}>
                {toPersianNumbers(filteredData.length.toString())} معامله
              </div>
              <Pagination dir="ltr" className="w-auto justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                      aria-disabled={!canPreviousPage}
                      className={`border border-[#E4E4E7] ${!canPreviousPage ? "hidden" : "cursor-pointer"}`}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))}
                          isActive={pagination.pageIndex + 1 === page}
                          className={`border border-[#E4E4E7]  cursor-pointer aria-[current=page]:bg-primary aria-[current=page]:text-white`}
                        >
                          {toPersianNumbers(page.toString())}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                      aria-disabled={!canNextPage}
                      className={`border border-[#E4E4E7] ${!canNextPage ? "hidden" : "cursor-pointer"}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}


