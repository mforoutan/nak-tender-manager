import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { PublishedProcess, TenderListItem, PublishedProcessListResponse, DatabaseRow } from '@/types';

// Helper function to determine status based on dates
function determineStatus(
  publishDate: Date | string | null,
  submissionEndDate: Date | string | null,
  processStatus: string
): 'ongoing' | 'upcoming' | 'completed' {
  const now = new Date();
  
  // If explicitly closed or cancelled
  if (processStatus === 'CLOSED' || processStatus === 'CANCELLED') {
    return 'completed';
  }
  
  const pubDate = publishDate ? new Date(publishDate) : null;
  const endDate = submissionEndDate ? new Date(submissionEndDate) : null;
  
  // If not yet published
  if (pubDate && pubDate > now) {
    return 'upcoming';
  }
  
  // If deadline has passed
  if (endDate && endDate < now) {
    return 'completed';
  }
  
  // If currently accepting submissions
  if (pubDate && pubDate <= now && (!endDate || endDate >= now)) {
    return 'ongoing';
  }
  
  // Default to upcoming if dates are unclear
  return 'upcoming';
}

// Transform database record to TenderListItem
function transformToTenderItem(record: DatabaseRow): TenderListItem {
  const status = determineStatus(
    record.PUBLISH_DATE as Date | string | null,
    record.SUBMISSION_END_DATE as Date | string | null,
    record.STATUS as string
  );
  
  return {
    id: record.ID as number,
    title: (record.TITLE as string) || '',
    type: (record.PROCESS_TYPE as string) || 'مناقصه عمومی',
    status,
    endDate: record.SUBMISSION_END_DATE 
      ? new Date(record.SUBMISSION_END_DATE as string | Date).toISOString().split('T')[0]
      : '',
    category: (record.REQUEST_CATEGORY as string) || 'تجهیزات صنعتی',
    code: (record.PUBLICATION_NUMBER as string) || '',
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const search = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || 'all';
    const typeFilter = searchParams.get('type') || '';
    const categoryFilter = searchParams.get('category') || '';
    const endDateFilter = searchParams.get('endDate') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Build the base query with JOINs to get related data
    let sql = `
      SELECT 
        pp.ID,
        pp.TRANSACTION_PROCESSES_ID,
        pp.PUBLICATION_NUMBER,
        pp.TITLE,
        pp.DESCRIPTION,
        pp.STATUS,
        pp.PUBLISH_DATE,
        pp.DEADLINE_DATE,
        pp.SUBMISSION_START_DATE,
        pp.SUBMISSION_END_DATE,
        pp.ESTIMATED_VALUE,
        pp.CURRENCY,
        pp.PUBLICATION_ROUND,
        pp.DOCUMENT_PRICE,
        pp.DOCUMENT_CURRENCY,
        pp.IS_ACTIVE,
        tpt.TYPE_NAME AS PROCESS_TYPE,
        prt.TYPE_NAME AS REQUEST_TYPE,
        prc.CATEGORY_NAME AS REQUEST_CATEGORY,
        bp.PROVINCE_NAME,
        bc.CITY_NAME,
        br.REGION_NAME
      FROM PUBLISHED_PROCESSES pp
      LEFT JOIN TRANSACTION_PROCESSES tp ON pp.TRANSACTION_PROCESSES_ID = tp.ID
      LEFT JOIN TRANSACTION_PROCESS_TYPES tpt ON tp.PROCESS_TYPE_ID = tpt.ID
      LEFT JOIN PR_REQUEST_TYPES prt ON tp.PR_REQUEST_TYPE_ID = prt.ID
      LEFT JOIN PR_REQUEST_CATEGORIES prc ON tp.PR_REQUEST_CATEGORY_ID = prc.ID
      LEFT JOIN BASE_PROVINCE bp ON tp.EXECUTION_PROVINCE_ID = bp.ID
      LEFT JOIN BASE_CITY bc ON tp.EXECUTION_CITY_ID = bc.ID
      LEFT JOIN BASE_REGION br ON tp.EXECUTION_REGION_ID = br.ID
      WHERE pp.IS_ACTIVE = 1
    `;
    
    const params: (string | number)[] = [];
    let paramIndex = 1;
    
    // Add search filter
    if (search) {
      const searchValue = `%${search}%`;
      sql += ` AND (
        LOWER(pp.TITLE) LIKE LOWER(:search${paramIndex})
        OR LOWER(pp.PUBLICATION_NUMBER) LIKE LOWER(:search${paramIndex + 1})
        OR LOWER(prc.CATEGORY_NAME) LIKE LOWER(:search${paramIndex + 2})
      )`;
      params.push(searchValue, searchValue, searchValue);
      paramIndex += 3;
    }
    
    // Add type filter - use LIKE to handle variations in TYPE_NAME
    if (typeFilter) {
      sql += ` AND tpt.TYPE_NAME LIKE :type${paramIndex}`;
      params.push(`%${typeFilter}%`);
      paramIndex++;
    }
    
    // Add category filter
    if (categoryFilter) {
      sql += ` AND prc.CATEGORY_NAME = :category${paramIndex}`;
      params.push(categoryFilter);
      paramIndex++;
    }
    
    // Add end date filter
    if (endDateFilter) {
      sql += ` AND TRUNC(pp.SUBMISSION_END_DATE) = TO_DATE(:endDate${paramIndex}, 'YYYY-MM-DD')`;
      params.push(endDateFilter);
      paramIndex++;
    }
    
    // Order by publish date descending (newest first)
    sql += ` ORDER BY pp.PUBLISH_DATE DESC`;
    
    // Execute query to get all matching records
    const allRecords = await query(sql, params);
    
    // Transform and filter by status on the application side
    // (because status is derived from dates, not stored in DB)
    let allItems = (allRecords as DatabaseRow[]).map((record: DatabaseRow) => transformToTenderItem(record));
    
    // Apply status filter
    if (statusFilter !== 'all') {
      allItems = allItems.filter((item: TenderListItem) => item.status === statusFilter);
    }
    
    // Calculate pagination
    const total = allItems.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedItems = allItems.slice(offset, offset + limit);
    
    const response: PublishedProcessListResponse = {
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
    
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('Error fetching published processes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch published processes', details: errorMessage },
      { status: 500 }
    );
  }
}
