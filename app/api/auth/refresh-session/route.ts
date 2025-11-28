import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getSession, createSession, setSessionCookie } from '@/lib/auth';
import { SessionUser } from '@/types';

/**
 * Refresh session data by fetching latest information from database
 * This endpoint should be called after:
 * - Submitting account information
 * - After admin approves/rejects account
 * - After participating in a new tender
 */
export async function POST(request: NextRequest) {
  let connection;

  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'احراز هویت نشده' },
        { status: 401 }
      );
    }

    const { refreshFields } = await request.json();
    const contractorId = session.contractorId;

    connection = await getConnection();

    // Initialize updated session with existing data
    const updatedSession: SessionUser = { ...session };

    // Refresh process participation counts if requested or missing
    if (refreshFields?.includes('processParticipation') || !session.processParticipation) {
      const participationResult = await connection.execute<{
        tenderCount: number;
        inquiryCount: number;
        callCount: number;
      }>(
        `SELECT 
          COUNT(CASE WHEN tp.PROCESS_TYPE_ID = 1 THEN 1 END) as "tenderCount",
          COUNT(CASE WHEN tp.PROCESS_TYPE_ID = 4 THEN 1 END) as "inquiryCount",
          COUNT(CASE WHEN tp.PROCESS_TYPE_ID = 3 THEN 1 END) as "callCount"
        FROM PROCESS_SUBMISSION ps
        INNER JOIN PUBLISHED_PROCESSES pp ON ps.PUBLISHED_PROCESSES_ID = pp.ID
        INNER JOIN TRANSACTION_PROCESSES tp ON pp.TRANSACTION_PROCESSES_ID = tp.ID
        WHERE ps.CONTRACTOR_ID = :contractorId`,
        { contractorId }
      );

      updatedSession.processParticipation = participationResult.rows?.[0] || {
        tenderCount: 0,
        inquiryCount: 0,
        callCount: 0,
      };
    }

    // Refresh account task status if requested or missing
    if (refreshFields?.includes('accountTask') || !session.accountTask) {
      const taskResult = await connection.execute<any>(
        `SELECT 
          ID,
          STATUS,
          ACTION_COMMENT as "rejectionReason"
         FROM TASKS 
         WHERE ENTITY_TYPE = 'CONTRACTOR' 
         AND ENTITY_ID = :contractorId 
         ORDER BY ACTION_DATE DESC
         FETCH FIRST 1 ROWS ONLY`,
        { contractorId }
      );

      updatedSession.accountTask = taskResult.rows && taskResult.rows.length > 0
        ? {
            hasTask: true,
            status: taskResult.rows[0].STATUS as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED',
            rejectionReason: taskResult.rows[0].rejectionReason || undefined,
          }
        : {
            hasTask: false,
            status: null as null,
          };
    }

    // Create new session token with updated data
    const token = await createSession(updatedSession);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: updatedSession,
    });

  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی اطلاعات' },
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
