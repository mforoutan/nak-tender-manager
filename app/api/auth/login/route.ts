import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getConnection } from '@/lib/db';
import { createSession, setSessionCookie } from '@/lib/auth';
import { ContractorLogin, Contractor, SessionUser } from '@/types';

export async function POST(request: NextRequest) {
  let connection;

  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'نام کاربری و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    // Get database connection
    connection = await getConnection();

    // Query contractor login
    const loginResult = await connection.execute<ContractorLogin>(
      `SELECT 
        cl.ID,
        cl.CONTRACTOR_ID as "contractorId",
        cl.USERNAME,
        cl.PASSWORD_HASH as "passwordHash",
        cl.FIRST_NAME as "firstName",
        cl.LAST_NAME as "lastName",
        cl.IS_ACTIVE as "isActive"
      FROM CONTRACTOR_LOGIN cl
      WHERE UPPER(cl.USERNAME) = UPPER(:username)
      AND cl.IS_ACTIVE = 1`,
      { username }
    );

    if (!loginResult.rows || loginResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'نام کاربری یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

    const loginData = loginResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(
      password,
      loginData.passwordHash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'نام کاربری یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

    // Get contractor company info
    const contractorResult = await connection.execute<Contractor>(
      `SELECT 
        ID,
        COMPANY_NAME as "companyName",
        NATIONAL_ID as "nationalId",
        EMAIL,
        PHONE,
        STATUS
      FROM CONTRACTORS
      WHERE ID = :contractorId`,
      { contractorId: loginData.contractorId }
    );

    if (!contractorResult.rows || contractorResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'اطلاعات شرکت یافت نشد' },
        { status: 404 }
      );
    }

    const contractor = contractorResult.rows[0];

    // Fetch process participation counts by type (efficient single query)
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
      { contractorId: loginData.contractorId }
    );

    const processParticipation = participationResult.rows?.[0] || {
      tenderCount: 0,
      inquiryCount: 0,
      callCount: 0,
    };

    // Fetch account task status
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
      { contractorId: loginData.contractorId }
    );

    const accountVerificationTask = taskResult.rows && taskResult.rows.length > 0
      ? {
          hasTask: true,
          status: taskResult.rows[0].STATUS as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED',
          rejectionReason: taskResult.rows[0].rejectionReason || undefined,
        }
      : {
          hasTask: false,
          status: null as null,
        };

    // Update last login
    await connection.execute(
      `UPDATE CONTRACTOR_LOGIN 
       SET LAST_LOGIN = SYSDATE 
       WHERE ID = :id`,
      { id: loginData.id }
    );

    await connection.commit();

    // Create session
    const sessionUser: SessionUser = {
      id: loginData.id,
      contractorId: loginData.contractorId,
      username: loginData.username,
      firstName: loginData.firstName,
      lastName: loginData.lastName,
      companyName: contractor.companyName,
      companyStatus: (contractor as any).STATUS || 1,
      processParticipation,
      accountVerificationTask,
    };

    const token = await createSession(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'خطا در ورود به سیستم' },
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