import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session?.contractorId) {
    return NextResponse.json({ error: 'غیرمجاز' }, { status: 401 });
  }

  let connection;
  try {
    const body = await request.json();
    const { oldPassword, newPassword } = body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'رمز عبور فعلی و جدید الزامی است' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // Get current password hash
    const result = await connection.execute(
      `SELECT PASSWORD_HASH FROM CONTRACTOR_LOGIN WHERE CONTRACTOR_ID = :contractorId`,
      [session.contractorId]
    );

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    const currentPasswordHash = (result.rows[0] as any).PASSWORD_HASH;

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, currentPasswordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'رمز عبور فعلی اشتباه است' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await connection.execute(
      `UPDATE CONTRACTOR_LOGIN 
       SET PASSWORD_HASH = :newPasswordHash
       WHERE CONTRACTOR_ID = :contractorId`,
      {
        newPasswordHash,
        contractorId: session.contractorId
      }
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: 'رمز عبور با موفقیت تغییر یافت'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    await connection?.rollback();
    return NextResponse.json(
      { error: 'خطا در تغییر رمز عبور' },
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
