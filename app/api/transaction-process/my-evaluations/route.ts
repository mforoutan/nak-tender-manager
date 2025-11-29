import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getConnection } from '@/lib/db';
import { TenderListItem } from '@/types';
import oracledb from 'oracledb';

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    // Get session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'لطفا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    const contractorId = session.contractorId;

    // Get connection
    connection = await getConnection();

    // Query to fetch all evaluations for processes where contractor has submitted
    // We join through PROCESS_SUBMISSION to find evaluations for processes the contractor participated in
    const query = `
      SELECT DISTINCT
        pe.ID as evaluation_id,
        pe.STATUS as evaluation_status,
        pe.ASSIGNMENT_DATE,
        pe.DUE_DATE,
        pp.ID as published_process_id,
        pp.PUBLICATION_NUMBER as code,
        pp.TITLE as title,
        pp.SUBMISSION_END_DATE as end_date,
        tp.ID as transaction_process_id,
        tpt.TYPE_NAME as process_type,
        prc.CATEGORY_NAME as request_category,
        ps.ID as submission_id,
        ps.STATUS as submission_status
      FROM PROCESS_EVALUATIONS pe
      INNER JOIN TRANSACTION_PROCESSES tp 
        ON pe.TRANSACTION_PROCESS_ID = tp.ID
      INNER JOIN PUBLISHED_PROCESSES pp 
        ON tp.ID = pp.TRANSACTION_PROCESSES_ID
      INNER JOIN PROCESS_SUBMISSION ps 
        ON pp.ID = ps.PUBLISHED_PROCESSES_ID 
        AND ps.CONTRACTOR_ID = :contractorId
      LEFT JOIN TRANSACTION_PROCESS_TYPES tpt 
        ON tp.PROCESS_TYPE_ID = tpt.ID
      LEFT JOIN PR_REQUEST_CATEGORIES prc 
        ON tp.PR_REQUEST_CATEGORY_ID = prc.ID
      WHERE pe.IS_FORCED_FOR_CONTRACTORS = 1
        OR pe.PROCESS_SUBMISSION_ID = ps.ID
      ORDER BY pe.ASSIGNMENT_DATE DESC NULLS LAST
    `;

    const result = await connection.execute(query, {
      contractorId
    }, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    const rows = result.rows as any[];

    // Transform to TenderListItem format
    const tenderList: TenderListItem[] = rows.map(row => {
      // Determine status based on evaluation status and dates
      let status: 'ongoing' | 'upcoming' | 'completed' = 'ongoing';
      
      const now = new Date();
      const dueDate = row.DUE_DATE ? new Date(row.DUE_DATE) : null;
      const evaluationStatus = row.EVALUATION_STATUS;
      
      // Status logic:
      // - If evaluation is completed/closed -> 'completed'
      // - If due date has passed -> 'completed'
      // - If evaluation is pending/in-progress -> 'ongoing'
      // - If assignment date is in future -> 'upcoming'
      if (evaluationStatus === 'COMPLETED' || evaluationStatus === 'CLOSED') {
        status = 'completed';
      } else if (dueDate && dueDate < now) {
        status = 'completed';
      } else if (evaluationStatus === 'PENDING' || evaluationStatus === 'IN_PROGRESS') {
        status = 'ongoing';
      } else {
        const assignmentDate = row.ASSIGNMENT_DATE ? new Date(row.ASSIGNMENT_DATE) : null;
        if (assignmentDate && assignmentDate > now) {
          status = 'upcoming';
        }
      }

      return {
        id: row.PUBLISHED_PROCESS_ID,
        title: row.TITLE || '',
        type: row.PROCESS_TYPE || 'نامشخص',
        status,
        endDate: row.DUE_DATE ? new Date(row.DUE_DATE).toISOString() : 
                 (row.END_DATE ? new Date(row.END_DATE).toISOString() : ''),
        category: row.REQUEST_CATEGORY || 'نامشخص',
        code: row.PUBLICATION_NUMBER || '',
      };
    });

    return NextResponse.json({
      success: true,
      data: tenderList
    });

  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت ارزیابی‌ها' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}
