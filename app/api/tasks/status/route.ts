import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contractorId = searchParams.get('contractorId');

  if (!contractorId) {
    return NextResponse.json({ error: 'Contractor ID is required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT 
        ID,
        ENTITY_TYPE,
        ENTITY_ID,
        ITEM_TYPE,
        TITLE,
        DESCRIPTION,
        STATUS,
        PRIORITY,
        ASSIGNED_TO,
        ASSIGNED_BY,
        ASSIGNED_DATE,
        DUE_DATE,
        COMPLETED_DATE,
        ACTION_TYPE,
        ACTION_COMMENT,
        ACTION_BY,
        ACTION_DATE,
        TASK_TYPE
       FROM TASKS 
       WHERE ENTITY_TYPE = 'CONTRACTOR' 
       AND ENTITY_ID = :contractorId 
       ORDER BY ACTION_DATE DESC
       FETCH FIRST 1 ROWS ONLY`,
      [contractorId]
    );

    if (result.rows && result.rows.length > 0) {
      const task = result.rows[0];
      
      return NextResponse.json({
        task: {
          id: task.ID,
          entityType: task.ENTITY_TYPE,
          entityId: task.ENTITY_ID,
          itemType: task.ITEM_TYPE,
          title: task.TITLE,
          description: task.DESCRIPTION,
          status: task.STATUS,
          priority: task.PRIORITY,
          assignedTo: task.ASSIGNED_TO,
          assignedBy: task.ASSIGNED_BY,
          assignedDate: task.ASSIGNED_DATE,
          dueDate: task.DUE_DATE,
          completedDate: task.COMPLETED_DATE,
          actionType: task.ACTION_TYPE,
          actionComment: task.ACTION_COMMENT,
          actionBy: task.ACTION_BY,
          actionDate: task.ACTION_DATE,
          taskType: task.TASK_TYPE,
        },
        hasTask: true,
      });
    }

    return NextResponse.json({
      task: null,
      hasTask: false,
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task status' },
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