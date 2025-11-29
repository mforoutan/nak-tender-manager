import type { TabConfig } from "./types"
import { DataTable } from "./data-table"

interface DataTableServerProps {
  searchParams?: {
    search?: string
    status?: string
    type?: string
    date?: string
    page?: string
  }
  itemsPerPage?: number
  tabs?: TabConfig[]
  showStatusFilter?: boolean
  showStatus?: boolean
  apiEndpoint: string
}

async function fetchTenders(
  apiEndpoint: string,
  searchParams: DataTableServerProps['searchParams'],
  itemsPerPage: number
) {
  const params = new URLSearchParams()
  
  if (searchParams?.search) params.set('search', searchParams.search)
  if (searchParams?.status) params.set('status', searchParams.status)
  if (searchParams?.type && searchParams.type !== 'all') {
    const typeMap: Record<string, string> = {
      'tender': 'مناقصه عمومی',
      'inquiry': 'استعلام',
      'call': 'فراخوان',
      'evaluation': 'ارزیابی',
    }
    const mappedType = typeMap[searchParams.type] || searchParams.type
    params.set('type', mappedType)
  }
  if (searchParams?.date) params.set('endDate', searchParams.date)
  if (searchParams?.page) params.set('page', searchParams.page)
  
  params.set('limit', itemsPerPage.toString())
  
  // Construct full URL for API call
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}${apiEndpoint}?${params.toString()}`
  
  try {
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch data:', response.statusText)
      return { data: [], total: 0 }
    }
    
    const result = await response.json()
    
    return {
      data: result.data || [],
      total: result.pagination?.total || 0
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { data: [], total: 0 }
  }
}

export async function DataTableServer({
  searchParams,
  itemsPerPage = 10,
  tabs,
  showStatusFilter,
  showStatus,
  apiEndpoint
}: DataTableServerProps) {
  // Set default values for searchParams
  const params = {
    status: searchParams?.status || 'ongoing',
    type: searchParams?.type || 'all',
    search: searchParams?.search,
    date: searchParams?.date,
    page: searchParams?.page || '1',
  }
  
  const { data, total } = await fetchTenders(apiEndpoint, params, itemsPerPage)

  return (
    <DataTable
      data={data}
      totalCount={total}
      itemsPerPage={itemsPerPage}
      tabs={tabs}
      showStatusFilter={showStatusFilter}
      showStatus={showStatus}
    />
  )
}
