import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();
  
  if (!session?.contractorId) {
    return NextResponse.json({ error: 'غیرمجاز' }, { status: 401 });
  }

  const contractorId = session.contractorId;

  let connection;
  try {
    connection = await getConnection();

    // Fetch all profile data in parallel
    const [
      membersResult,
      projectsResult,
      equipmentResult,
      rankingsResult,
      certificatesResult,
      activitiesResult
    ] = await Promise.all([
      // Members (exclude CEO and REPRESENTATIVE as they're in account page)
      connection.execute(
        `SELECT * FROM CONTRACTOR_MEMBERS 
         WHERE CONTRACTOR_ID = :id 
         AND IS_ACTIVE = 1 
         AND POSITION_TITLE NOT IN ('مدیرعامل', 'نماینده شرکت')
         ORDER BY CREATED_DATE DESC`,
        [contractorId]
      ),
      // Projects
      connection.execute(
        `SELECT * FROM CONTRACTOR_PROJECTS 
         WHERE CONTRACTOR_ID = :id AND IS_ACTIVE = 1
         ORDER BY CREATED_DATE DESC`,
        [contractorId]
      ),
      // Equipment
      connection.execute(
        `SELECT * FROM CONTRACTOR_EQUIPMENT 
         WHERE CONTRACTOR_ID = :id AND IS_ACTIVE = 1
         ORDER BY CREATED_DATE DESC`,
        [contractorId]
      ),
      // Rankings
      connection.execute(
        `SELECT * FROM CONTRACTOR_RANKINGS 
         WHERE CONTRACTOR_ID = :id AND IS_ACTIVE = 1
         ORDER BY CREATED_DATE DESC`,
        [contractorId]
      ),
      // Certificates
      connection.execute(
        `SELECT cc.*, fs.FILE_NAME, fs.ORIGINAL_NAME, fs.MIME_TYPE, fs.FILE_SIZE
         FROM CONTRACTOR_CERTIFICATES cc
         LEFT JOIN FILE_STORE fs ON cc.CERTIFICATE_FILE_ID = fs.ID
         WHERE cc.CONTRACTOR_ID = :id AND cc.IS_ACTIVE = 1
         ORDER BY cc.CREATED_DATE DESC`,
        [contractorId]
      ),
      // Activities
      connection.execute(
        `SELECT ca.*, bca.ACTIVITY_NAME
         FROM CONTRACTOR_ACTIVITY ca
         LEFT JOIN BASE_CONTRACTOR_ACTIVITY bca ON ca.ACTIVITY_ID = bca.ID
         WHERE ca.CONTRACTOR_ID = :id
         ORDER BY ca.ID DESC`,
        [contractorId]
      )
    ]);

    // Serialize function
    const serializeRows = (rows: any[] | undefined) => {
      if (!rows || rows.length === 0) return [];
      
      return rows.map(row => {
        const cleanRow: any = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            const value = row[key];
            if (value === null || value === undefined) {
              cleanRow[key] = null;
            } else if (value instanceof Date) {
              cleanRow[key] = value.toISOString();
            } else {
              cleanRow[key] = value;
            }
          }
        }
        return cleanRow;
      });
    };

    return NextResponse.json({
      success: true,
      data: {
        members: serializeRows(membersResult.rows),
        projects: serializeRows(projectsResult.rows),
        equipment: serializeRows(equipmentResult.rows),
        rankings: serializeRows(rankingsResult.rows),
        certificates: serializeRows(certificatesResult.rows),
        activities: serializeRows(activitiesResult.rows),
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات' },
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
