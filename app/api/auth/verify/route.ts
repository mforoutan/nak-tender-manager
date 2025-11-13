import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'احراز هویت نشده' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: session,
    });
  } catch (error) {
    console.error('Verify session error:', error);
    return NextResponse.json(
      { error: 'خطا در بررسی احراز هویت' },
      { status: 500 }
    );
  }
}
