import { Suspense } from "react"
import { DataTable } from "./data-table"
import { DataTableSkeleton } from "./data-table-skeleton"
import type { TabConfig } from "./types"
import type { TenderListItem } from "@/types"

interface DataTableServerProps {
  searchParams?: Promise<{
    search?: string
    status?: string
    type?: string
    date?: string
    page?: string
  }>
  itemsPerPage?: number
  tabs?: TabConfig[]
  showStatusFilter?: boolean
  showStatus?: boolean
  apiEndpoint?: string
}

async function fetchTenders(
  searchParams: DataTableServerProps['searchParams'],
  apiEndpoint: string = '/api/published-processes'
): Promise<{ data: TenderListItem[], total: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    // Await searchParams (Next.js 15 requirement)
    const params = new URLSearchParams()
    const resolvedParams = searchParams ? await searchParams : {}
    
    if (resolvedParams?.search) params.set('search', resolvedParams.search)
    // Default to 'ongoing' status if not specified
    params.set('status', resolvedParams?.status || 'ongoing')
    if (resolvedParams?.type) params.set('type', resolvedParams.type)
    if (resolvedParams?.date) params.set('endDate', resolvedParams.date)
    if (resolvedParams?.page) params.set('page', resolvedParams.page)
    
    // Always set a reasonable limit for server-side fetching
    params.set('limit', '1000')
    
    const url = `${baseUrl}${apiEndpoint}?${params.toString()}`
    
    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    if (!response.ok) {
      console.error('Failed to fetch tenders:', response.statusText)
      return { data: [], total: 0 }
    }
    
    const result = await response.json()
    return {
      data: result.data || [],
      total: result.pagination?.total || 0
    }
  } catch (error) {
    console.error('Error fetching tenders:', error)
    return { data: [], total: 0 }
  }
}

async function DataTableContent(props: DataTableServerProps) {
  const { data, total } = await fetchTenders(props.searchParams, props.apiEndpoint)
  
  return (
    <DataTable
      data={data}
      totalCount={total}
      itemsPerPage={props.itemsPerPage}
      tabs={props.tabs}
      showStatusFilter={props.showStatusFilter}
      showStatus={props.showStatus}
    />
  )
}

export function DataTableServer(props: DataTableServerProps) {
  return (
    <Suspense fallback={<DataTableSkeleton itemsPerPage={props.itemsPerPage} tabs={props.tabs} showStatusFilter={props.showStatusFilter} />}>
      <DataTableContent {...props} />
    </Suspense>
  )
}
