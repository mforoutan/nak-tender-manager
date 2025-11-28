import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session?.contractorId) {
    return NextResponse.json({ error: 'غیرمجاز' }, { status: 401 });
  }

  const contractorId = session.contractorId;
  const body = await request.json();
  const { members, projects, equipment, rankings, certificates, activities } = body;

  let connection;
  try {
    connection = await getConnection();

    // 1. Handle Members
    if (members && Array.isArray(members)) {
      for (const member of members) {
        if (member.id && typeof member.id === 'number') {
          // Update existing member
          await connection.execute(
            `UPDATE CONTRACTOR_MEMBERS SET
              FIRST_NAME = :firstName,
              LAST_NAME = :lastName,
              EMAIL = :email,
              NATIONAL_ID = :nationalId,
              MOBILE = :mobile,
              WORK_EXPERIENCE_YEARS = :workExpYears,
              FIELD_OF_STUDY = :fieldOfStudy,
              EDUCATION_LEVEL = :educationLevel,
              POSITION_TITLE = :positionTitle,
              MODIFIED_DATE = SYSDATE
             WHERE ID = :id AND CONTRACTOR_ID = :contractorId`,
            {
              firstName: member.FIRST_NAME || null,
              lastName: member.LAST_NAME || null,
              email: member.EMAIL || null,
              nationalId: member.NATIONAL_ID || null,
              mobile: member.MOBILE || null,
              workExpYears: member.WORK_EXPERIENCE_YEARS || null,
              fieldOfStudy: member.FIELD_OF_STUDY || null,
              educationLevel: member.EDUCATION_LEVEL || null,
              positionTitle: member.POSITION_TITLE || null,
              id: member.id,
              contractorId,
            }
          );
        } else {
          // Insert new member
          await connection.execute(
            `INSERT INTO CONTRACTOR_MEMBERS 
             (CONTRACTOR_ID, FIRST_NAME, LAST_NAME, EMAIL, NATIONAL_ID, MOBILE, 
              WORK_EXPERIENCE_YEARS, FIELD_OF_STUDY, EDUCATION_LEVEL, POSITION_TITLE, 
              IS_ACTIVE, CREATED_DATE)
             VALUES 
             (:contractorId, :firstName, :lastName, :email, :nationalId, :mobile,
              :workExpYears, :fieldOfStudy, :educationLevel, :positionTitle,
              1, SYSDATE)`,
            {
              contractorId,
              firstName: member.FIRST_NAME || null,
              lastName: member.LAST_NAME || null,
              email: member.EMAIL || null,
              nationalId: member.NATIONAL_ID || null,
              mobile: member.MOBILE || null,
              workExpYears: member.WORK_EXPERIENCE_YEARS || null,
              fieldOfStudy: member.FIELD_OF_STUDY || null,
              educationLevel: member.EDUCATION_LEVEL || null,
              positionTitle: member.POSITION_TITLE || null,
            }
          );
        }
      }
    }

    // 2. Handle Projects
    if (projects && Array.isArray(projects)) {
      for (const project of projects) {
        if (project.id && typeof project.id === 'number') {
          // Update existing project
          await connection.execute(
            `UPDATE CONTRACTOR_PROJECTS SET
              PROJECT_TITLE = :projectTitle,
              CLIENT_NAME = :clientName,
              REFERENCE_PHONE = :referencePhone,
              COMPLETION_STATUS = :completionStatus,
              PROJECT_VALUE = :projectValue,
              START_DATE = TO_DATE(:startDate, 'YYYY-MM-DD'),
              END_DATE = TO_DATE(:endDate, 'YYYY-MM-DD'),
              PROJECT_TYPE = :projectType,
              PROJECT_DESCRIPTION = :projectDescription,
              MODIFIED_DATE = SYSDATE
             WHERE ID = :id AND CONTRACTOR_ID = :contractorId`,
            {
              projectTitle: project.PROJECT_TITLE || null,
              clientName: project.CLIENT_NAME || null,
              referencePhone: project.REFERENCE_PHONE || null,
              completionStatus: project.COMPLETION_STATUS || null,
              projectValue: project.PROJECT_VALUE || null,
              startDate: project.START_DATE || null,
              endDate: project.END_DATE || null,
              projectType: project.PROJECT_TYPE || null,
              projectDescription: project.PROJECT_DESCRIPTION || null,
              id: project.id,
              contractorId,
            }
          );
        } else {
          // Insert new project
          await connection.execute(
            `INSERT INTO CONTRACTOR_PROJECTS 
             (CONTRACTOR_ID, PROJECT_TITLE, CLIENT_NAME, REFERENCE_PHONE, 
              COMPLETION_STATUS, PROJECT_VALUE, START_DATE, END_DATE, 
              PROJECT_TYPE, PROJECT_DESCRIPTION, IS_ACTIVE, CREATED_DATE)
             VALUES 
             (:contractorId, :projectTitle, :clientName, :referencePhone,
              :completionStatus, :projectValue, TO_DATE(:startDate, 'YYYY-MM-DD'), 
              TO_DATE(:endDate, 'YYYY-MM-DD'), :projectType, :projectDescription, 1, SYSDATE)`,
            {
              contractorId,
              projectTitle: project.PROJECT_TITLE || null,
              clientName: project.CLIENT_NAME || null,
              referencePhone: project.REFERENCE_PHONE || null,
              completionStatus: project.COMPLETION_STATUS || null,
              projectValue: project.PROJECT_VALUE || null,
              startDate: project.START_DATE || null,
              endDate: project.END_DATE || null,
              projectType: project.PROJECT_TYPE || null,
              projectDescription: project.PROJECT_DESCRIPTION || null,
            }
          );
        }
      }
    }

    // 3. Handle Equipment
    if (equipment && Array.isArray(equipment)) {
      for (const item of equipment) {
        if (item.id && typeof item.id === 'number') {
          // Update existing equipment
          await connection.execute(
            `UPDATE CONTRACTOR_EQUIPMENT SET
              EQUIPMENT_NAME = :equipmentName,
              EQUIPMENT_TYPE = :equipmentType,
              QUANTITY = :quantity,
              MODIFIED_DATE = SYSDATE
             WHERE ID = :id AND CONTRACTOR_ID = :contractorId`,
            {
              equipmentName: item.EQUIPMENT_NAME || null,
              equipmentType: item.EQUIPMENT_TYPE || null,
              quantity: item.QUANTITY || null,
              id: item.id,
              contractorId,
            }
          );
        } else {
          // Insert new equipment
          await connection.execute(
            `INSERT INTO CONTRACTOR_EQUIPMENT 
             (CONTRACTOR_ID, EQUIPMENT_NAME, EQUIPMENT_TYPE, QUANTITY, 
              IS_ACTIVE, CREATED_DATE)
             VALUES 
             (:contractorId, :equipmentName, :equipmentType, :quantity, 1, SYSDATE)`,
            {
              contractorId,
              equipmentName: item.EQUIPMENT_NAME || null,
              equipmentType: item.EQUIPMENT_TYPE || null,
              quantity: item.QUANTITY || null,
            }
          );
        }
      }
    }

    // 4. Handle Rankings
    if (rankings && Array.isArray(rankings)) {
      for (const ranking of rankings) {
        if (ranking.id && typeof ranking.id === 'number') {
          // Update existing ranking
          await connection.execute(
            `UPDATE CONTRACTOR_RANKINGS SET
              RANKING_TYPE = :rankingType,
              RANKING_LEVEL = :rankingLevel,
              NOTES = :notes,
              MODIFIED_DATE = SYSDATE
             WHERE ID = :id AND CONTRACTOR_ID = :contractorId`,
            {
              rankingType: ranking.RANKING_TYPE || null,
              rankingLevel: ranking.RANKING_LEVEL || null,
              notes: ranking.NOTES || null,
              id: ranking.id,
              contractorId,
            }
          );
        } else {
          // Insert new ranking
          await connection.execute(
            `INSERT INTO CONTRACTOR_RANKINGS 
             (CONTRACTOR_ID, RANKING_TYPE, RANKING_LEVEL, NOTES, 
              IS_ACTIVE, CREATED_DATE)
             VALUES 
             (:contractorId, :rankingType, :rankingLevel, :notes, 1, SYSDATE)`,
            {
              contractorId,
              rankingType: ranking.RANKING_TYPE || null,
              rankingLevel: ranking.RANKING_LEVEL || null,
              notes: ranking.NOTES || null,
            }
          );
        }
      }
    }

    // TODO: Handle certificates and activities when fields are defined

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: 'اطلاعات با موفقیت ذخیره شد',
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
      { error: 'خطا در ذخیره اطلاعات' },
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
