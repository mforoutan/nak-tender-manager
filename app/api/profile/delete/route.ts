import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  
  if (!session?.contractorId) {
    return NextResponse.json({ error: 'غیرمجاز' }, { status: 401 });
  }

  const contractorId = session.contractorId;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!type || !id) {
    return NextResponse.json({ error: 'نوع یا شناسه مشخص نشده' }, { status: 400 });
  }

  let connection;
  try {
    connection = await getConnection();

    let query = '';
    
    switch (type) {
      case 'member':
        query = `UPDATE CONTRACTOR_MEMBERS SET IS_ACTIVE = 0 
                 WHERE ID = :id AND CONTRACTOR_ID = :contractorId`;
        break;
      case 'project':
        query = `UPDATE CONTRACTOR_PROJECTS SET IS_ACTIVE = 0 
                 WHERE ID = :id AND CONTRACTOR_ID = :contractorId`;
        break;
      case 'equipment':
        query = `UPDATE CONTRACTOR_EQUIPMENT SET IS_ACTIVE = 0 
                 WHERE ID = :id AND CONTRACTOR_ID = :contractorId`;
        break;
      case 'ranking':
        query = `UPDATE CONTRACTOR_RANKINGS SET IS_ACTIVE = 0 
                 WHERE ID = :id AND CONTRACTOR_ID = :contractorId`;
        break;
      case 'certificate':
        query = `UPDATE CONTRACTOR_CERTIFICATES SET IS_ACTIVE = 0 
                 WHERE ID = :id AND CONTRACTOR_ID = :contractorId`;
        break;
      case 'activity':
        query = `DELETE FROM CONTRACTOR_ACTIVITY 
                 WHERE ID = :id AND CONTRACTOR_ID = :contractorId`;
        break;
      default:
        return NextResponse.json({ error: 'نوع نامعتبر' }, { status: 400 });
    }

    await connection.execute(query, { id: Number(id), contractorId });
    await connection.commit();

    return NextResponse.json({
      success: true,
      message: 'رکورد با موفقیت حذف شد',
    });

  } catch (error) {
    console.error('Database error:', error);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
    return NextResponse.json(
      { error: 'خطا در حذف رکورد' },
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
