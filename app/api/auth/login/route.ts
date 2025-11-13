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