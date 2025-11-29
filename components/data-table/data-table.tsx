"use client"

import * as React from "react"
import { AwardIcon, MilestoneIcon, Calendar1Icon, Search, SearchCheckIcon, GavelIcon, StickerIcon, Clock, MegaphoneIcon, FileX2 } from "lucide-react"

import { toPersianNumbers, toPersianDate } from "@/lib/utils"
import type { TenderListItem } from "@/types"
import type { TabConfig } from "./types"

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
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty"
import Link from "next/link"
import { PersianDatePicker } from "@/components/ui/persian-date-picker"

// Re-export TabConfig for convenience
export type { TabConfig } from "./types"

function CardIcon({ type, status }: { type: string, status: string }) {
  if (type.includes("قرارداد")) {
    return (
      <div className="bg-[#FF00DD] text-white rounded-full p-3">
        <StickerIcon />
      </div>
    )
  }
  if (type.includes("ارزیابی")) {
    return (
      <div className="bg-[#0088FF] text-white rounded-full p-3">
        <Clock />
      </div>
    )
  }
  if (type.includes("فراخوان")) {
    return (
      <div className="bg-[#FFF4F0] text-primary rounded-full p-3">
        <MegaphoneIcon />
      </div>
    )
  }
  if (type.includes("استعلام")) {
    return (
      <div className="bg-[#FFF4F0] text-primary rounded-full p-3">
        <SearchCheckIcon />
      </div>
    )
  }
  if (type.includes("مزایده")) {
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
  if (type.includes("ارزیابی")) {
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

function TypeBadge({ type }: { type: string }) {
  // Check if type contains these keywords (not exact match)
  if (type.includes("مناقصه")) {
    return (
      <Badge variant="outline" className="text-primary border-[#FFDED0] bg-[#FFF4F0] rounded-md px-2">
        {type}
      </Badge>
    );
  }
  
  if (type.includes("استعلام")) {
    return (
      <Badge variant="outline" className="text-primary border-[#FFDED0] bg-[#FFF4F0] rounded-md px-2">
        {type}
      </Badge>
    );
  }
  
  if (type.includes("فراخوان")) {
    return (
      <Badge variant="outline" className="text-primary border-[#FFDED0] bg-[#FFF4F0] rounded-md px-2">
        {type}
      </Badge>
    );
  }
  
  if (type.includes("ارزیابی")) {
    return (
      <Badge variant="outline" className="text-black border border-[#E4E4E7] bg-transparent rounded-md px-2">
        {type}
      </Badge>
    );
  }
  
  if (type.includes("مزایده")) {
    return (
      <Badge variant="outline" className="text-black border border-[#E4E4E7] bg-transparent rounded-md px-2">
        {type}
      </Badge>
    );
  }
  
  if (type.includes("قرارداد")) {
    return (
      <Badge variant="outline" className="text-black border border-[#E4E4E7] bg-transparent rounded-md px-2">
        {type}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-black border border-[#E4E4E7] bg-transparent rounded-md px-2">
      {type}
    </Badge>
  );
}

function DataCard({ item, showStatus = false }: { item: TenderListItem, showStatus: boolean }) {
  return (
    <Card className="overflow-hidden pl-14 pr-14  py-6 lg:pr-22 relative gap-1 hover:bg-[#FFF4F0]">
      <div className="absolute inset-y-0 right-0 hidden lg:flex items-center pr-6">
        <CardIcon type={item.type} status={item.status} />
      </div>
      <CardHeader className="px-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 justify-between">
            <div className="flex flex-col lg:flex-row flex-1 gap-2">
              <Link href={`/dashboard/pr/${item.code}`} className="text-sm font-bold">
                <h3 className="inline">
                  {item.title}
                </h3>
              </Link>
              <div className="flex gap-2 order-first lg:order-last">
                <TypeBadge type={item.type} />
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
  totalCount,
}: {
  data: TenderListItem[]
  itemsPerPage?: number
  tabs?: TabConfig[],
  showStatusFilter?: boolean,
  showStatus?: boolean
  totalCount?: number
}) {
  // State for filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDate, setSelectedDate] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ongoing")
  const [typeFilter, setTypeFilter] = React.useState<string>(tabs[0]?.value || "all")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: itemsPerPage,
  })

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  // Handle filter changes
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }

  const handleTypeChange = (value: string) => {
    setTypeFilter(value)
  }

  const handleDateChange = (value: string) => {
    setSelectedDate(value)
  }

  const handlePageChange = (pageIndex: number) => {
    setPagination(prev => ({ ...prev, pageIndex }))
  }

  // Client-side filtering
  const filteredData = React.useMemo(() => {
    return initialData.filter((item) => {
      const matchesSearch = searchQuery === "" ||
        item.title.includes(searchQuery) ||
        item.code.includes(searchQuery) ||
        item.category.includes(searchQuery)

      const matchesDate = selectedDate === "" || item.endDate === selectedDate
      const matchesStatus = item.status === statusFilter

      const currentTab = tabs.find(tab => tab.value === typeFilter)
      const matchesType = !currentTab?.typeFilter || item.type.includes(currentTab.typeFilter)

      return matchesSearch && matchesDate && matchesStatus && matchesType
    })
  }, [initialData, searchQuery, selectedDate, statusFilter, typeFilter, tabs])

  // Pagination - client-side slicing
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredData.slice(start, end)
  }, [filteredData, pagination])

  // Reset pagination when filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [searchQuery, selectedDate, statusFilter, typeFilter])

  const totalItems = filteredData.length
  const pageCount = Math.ceil(totalItems / pagination.pageSize)
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
      onValueChange={handleTypeChange}
      className="w-full flex-col justify-start gap-6"
    >
      {tabs.length > 0 && (
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
              onChange={handleDateChange}
              placeholder="تاریخ"
              className="w-auto gap-x-2 min-h-input-sm rounded-input px-sm py-2.5"
            />
            <InputGroup className="w-64" size="lg">
              <InputGroupInput
                placeholder="جستجو در معاملات..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="p-0 leading-7 h-7"
              />
              <InputGroupAddon className="pl-2 py-0">
                <Search className="size-4" />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      )}
      {(tabs.length > 0 ? tabs : [{ value: "all", label: "همه" }]).map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="relative flex flex-col gap-4 overflow-auto mx-4 p-7 space-y-10 lg:mx-6 lg:p-12 bg-[#F6F6F6] rounded-lg"
        >
          {showStatusFilter && (
            <div className="flex justify-center lg:justify-between">
              <Tabs value={statusFilter} onValueChange={handleStatusChange} dir="rtl">
                <TabsList className="bg-white mx-auto lg:mx-0 h-12 p-1">
                  <TabsTrigger className="data-[state=active]:bg-black h-10 text-base font-bold py-1.5 px-3" value="ongoing">در حال برگزاری</TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-black h-10 text-base font-bold py-1.5 px-3" value="upcoming">در انتظار برگزاری</TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-black h-10 text-base font-bold py-1.5 px-3" value="completed">برگزارشده</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="text-primary hidden flex-1 lg:flex justify-end">
                {toPersianNumbers(totalItems.toString())} معامله
              </div>
            </div>
          )}
          <div className="flex lg:hidden items-center justify-between gap-2">
            <PersianDatePicker
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="تاریخ"
              className="w-auto"
            />
            <InputGroup className="w-64 bg-white">
              <InputGroupInput
                placeholder="جستجو در معاملات..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
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
                {toPersianNumbers(totalItems.toString())} معامله
              </div>
              <Pagination dir="ltr" className="w-auto justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(pagination.pageIndex - 1)}
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
                          onClick={() => handlePageChange(page - 1)}
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
                      onClick={() => handlePageChange(pagination.pageIndex + 1)}
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


