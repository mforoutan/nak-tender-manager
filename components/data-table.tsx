"use client"

import * as React from "react"
import {
  IconCircleCheckFilled,
  IconLoader,
} from "@tabler/icons-react"
import { AwardIcon, MilestoneIcon, Calendar1Icon, Search } from "lucide-react"
import { z } from "zod"

import { toPersianNumbers } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartConfig,
} from "@/components/ui/chart"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

export const schema = z.object({
  id: z.number(),
  title: z.string(),
  type: z.string(),
  status: z.string(),
  endDate: z.string(),
  category: z.string(),
  code: z.string(),
})

// Helper function to convert Gregorian date to Persian calendar
function toPersianDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function DataCard({ item }: { item: z.infer<typeof schema> }) {
  return (
    <Card className="overflow-hidden pl-14 pr-14  py-6 lg:pr-22 relative gap-1 hover:bg-[#FFF4F0]">
      <div className="absolute inset-y-0 right-0 hidden lg:flex items-center pr-6">
        <div className="bg-[#FFF4F0] text-primary rounded-full p-3">
          <AwardIcon />
        </div>
      </div>
      <CardHeader className="px-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap flex-1 gap-2">
            <Link href={`/tenders/${item.id}`} className="w-full lg:flex-none text-lg font-semibold hover:underline">
              <h3 className="inline">
                {item.title}
              </h3>
            </Link>
            <div className="flex flex-1 gap-2 order-first lg:order-last">
              <Badge variant="outline" className="text-primary border-[#FFDED0] bg-[#FFF4F0] rounded-md px-2">
                {item.type}
              </Badge>
              <Badge variant="outline" className="text-black rounded-md px-2">
                {toPersianNumbers(item.code)}
              </Badge>
            </div>
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
}: {
  data: z.infer<typeof schema>[]
  itemsPerPage?: number
}) {
  const [data, setData] = React.useState(() => initialData)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDate, setSelectedDate] = React.useState("")
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

      return matchesSearch && matchesDate
    })
  }, [data, searchQuery, selectedDate])

  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredData.slice(start, end)
  }, [filteredData, pagination])

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
      defaultValue="all"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="bg-transparent flex mx-auto lg:mx-0 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1">
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="tender">
            مناقصه
          </TabsTrigger>
          <TabsTrigger value="inquiry">
            استعلام
          </TabsTrigger>
          <TabsTrigger value="evaluation">ارزیابی</TabsTrigger>
        </TabsList>
        <div className="hidden lg:flex items-center gap-2">
          <PersianDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="تاریخ"
            className="w-auto"
          />
          <InputGroup className="w-64">
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
      </div>
      <TabsContent
        value="all"
        className="relative flex flex-col gap-4 overflow-auto mx-4 p-7 space-y-10 lg:mx-6 lg:p-6 bg-[#F6F6F6] rounded-lg"
      >
        <div className="flex justify-center lg:justify-between">

          <Tabs defaultValue="ongoing" dir="rtl">
            <TabsList className="bg-white mx-auto lg:mx-0">
              <TabsTrigger className="data-[state=active]:bg-black" value="ongoing">در حال برگزاری</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-black" value="upcoming">در انتظار برگزاری</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-black" value="completed">برگزارشده</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="text-primary hidden flex-1 lg:flex justify-end">
            {toPersianNumbers(data.length.toString())} معامله
          </div>
        </div>
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
              <DataCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full flex h-24 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">نتیجه‌ای یافت نشد.</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="text-primary flex-1 flex lg:hidden justify-start">
            {toPersianNumbers(data.length.toString())} معامله
          </div>
            <Pagination dir="ltr" className="w-auto justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                    aria-disabled={!canPreviousPage}
                    className={`border border-[#E4E4E7] ${!canPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
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
                    className={`border border-[#E4E4E7] ${!canNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="tender"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="inquiry" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="evaluation"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

