import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contractorId = searchParams.get('id');

  if (!contractorId) {
    return NextResponse.json({ error: 'Contractor ID is required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await getConnection();

    // Fetch contractor basic info
    const contractorResult = await connection.execute(
      `SELECT * FROM CONTRACTORS WHERE ID = :id`,
      [contractorId]
    );

    if (!contractorResult.rows || contractorResult.rows.length === 0) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }

    // Fetch contractor members (CEO and representatives)
    const membersResult = await connection.execute(
      `SELECT * FROM CONTRACTOR_MEMBERS WHERE CONTRACTOR_ID = :id AND IS_ACTIVE = 1`,
      [contractorId]
    );

    // Fetch certificates/documents
    const certificatesResult = await connection.execute(
      `SELECT cc.*, fs.FILE_NAME, fs.ORIGINAL_NAME, fs.MIME_TYPE, fs.FILE_SIZE
       FROM CONTRACTOR_CERTIFICATES cc
       LEFT JOIN FILE_STORE fs ON cc.CERTIFICATE_FILE_ID = fs.ID
       WHERE cc.CONTRACTOR_ID = :id AND cc.IS_ACTIVE = 1`,
      [contractorId]
    );

    // Check for existing task
    const taskResult = await connection.execute(
      `SELECT * FROM TASKS 
       WHERE ENTITY_TYPE = 'CONTRACTOR' 
       AND ENTITY_ID = :id 
       ORDER BY ACTION_DATE DESC
       FETCH FIRST 1 ROWS ONLY`,
      [contractorId]
    );

    // Use a more robust serialization approach
    const serializeRows = (rows: any[] | undefined) => {
      if (!rows || rows.length === 0) return [];
      
      return rows.map(row => {
        const cleanRow: any = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            const value = row[key];
            // Handle different data types
            if (value === null || value === undefined) {
              cleanRow[key] = null;
            } else if (value instanceof Date) {
              cleanRow[key] = value.toISOString();
            } else if (typeof value === 'object' && value.constructor === Object) {
              cleanRow[key] = value;
            } else {
              cleanRow[key] = value;
            }
          }
        }
        return cleanRow;
      });
    };

    return NextResponse.json({
      contractor: contractorResult.rows[0] ? serializeRows([contractorResult.rows[0]])[0] : null,
      members: serializeRows(membersResult.rows),
      documents: serializeRows(certificatesResult.rows),
      tasks: serializeRows(taskResult.rows),
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contractor data' },
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
