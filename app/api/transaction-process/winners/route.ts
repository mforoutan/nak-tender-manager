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

    // Query to fetch all winners for the contractor
    const query = `
      SELECT 
        pw.ID as winner_id,
        pw.RANK_POSITION,
        pw.AWARD_DATE,
        pw.AWARD_AMOUNT,
        pw.CURRENCY,
        pw.STATUS as winner_status,
        pp.ID as published_process_id,
        pp.PUBLICATION_NUMBER as code,
        pp.TITLE as title,
        pp.SUBMISSION_END_DATE as end_date,
        tp.ID as transaction_process_id,
        tpt.NAME as process_type,
        prc.NAME as request_category
      FROM PROCESS_WINNERS pw
      INNER JOIN PUBLISHED_PROCESSES pp 
        ON pw.PUBLISHED_PROCESSES_ID = pp.ID
      INNER JOIN TRANSACTION_PROCESSES tp 
        ON pp.TRANSACTION_PROCESSES_ID = tp.ID
      LEFT JOIN TRANSACTION_PROCESS_TYPES tpt 
        ON tp.PROCESS_TYPE_ID = tpt.ID
      LEFT JOIN PR_REQUEST_CATEGORIES prc 
        ON tp.PR_REQUEST_CATEGORY_ID = prc.ID
      WHERE pw.CONTRACTOR_ID = :contractorId
      ORDER BY pw.AWARD_DATE DESC NULLS LAST, pw.RANK_POSITION ASC NULLS LAST
    `;

    const result = await connection.execute(query, {
      contractorId
    }, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    const rows = result.rows as any[];

    // Transform to TenderListItem format
    const tenderList: TenderListItem[] = rows.map(row => {
      // Determine status based on dates
      let status: 'ongoing' | 'upcoming' | 'completed' = 'completed';
      
      const now = new Date();
      const endDate = row.END_DATE ? new Date(row.END_DATE) : null;
      
      if (endDate) {
        if (endDate > now) {
          status = 'ongoing';
        } else {
          status = 'completed';
        }
      }

      return {
        id: row.PUBLISHED_PROCESS_ID,
        title: row.TITLE || '',
        type: row.PROCESS_TYPE || 'نامشخص',
        status,
        endDate: endDate ? endDate.toISOString() : '',
        category: row.REQUEST_CATEGORY || 'نامشخص',
        code: row.PUBLICATION_NUMBER || '',
      };
    });

    return NextResponse.json({
      success: true,
      data: tenderList
    });

  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت برندگان' },
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
