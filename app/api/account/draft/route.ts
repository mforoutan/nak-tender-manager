import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  let connection;
  try {
    const data = await request.json();
    const { contractorId, ...formData } = data;

    if (!contractorId) {
      return NextResponse.json({ error: 'Contractor ID is required' }, { status: 400 });
    }

    connection = await getConnection();

    // Check if there's a pending or completed task - if so, don't allow edit
    const taskCheck = await connection.execute(
      `SELECT STATUS FROM TASKS 
       WHERE ENTITY_TYPE = 'CONTRACTOR' 
       AND ENTITY_ID = :id 
       AND STATUS IN ('PENDING', 'COMPLETED')
       ORDER BY ACTION_DATE DESC
       FETCH FIRST 1 ROWS ONLY`,
      [contractorId]
    );

    if (taskCheck.rows && taskCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Cannot edit: Form is under review or completed' },
        { status: 403 }
      );
    }

    // Update CONTRACTORS table
    await connection.execute(
      `UPDATE CONTRACTORS SET
        COMPANY_NAME = :companyName,
        NATIONAL_ID = :nationalId,
        ECONOMIC_CODE = :economicCode,
        REGISTRATION_NUMBER = :registrationNumber,
        ESTABLISHMENT_DATE = TO_DATE(:establishmentDate, 'YYYY-MM-DD'),
        PHONE = :phone,
        FAX = :fax,
        EMAIL = :email,
        WEBSITE = :website,
        ADDRESS = :address,
        POSTAL_CODE = :postalCode,
        BANK_ACCOUNT = :accountNumber,
        SHABA_NUMBER = :ibanNumber,
        BRANCH_ACCOUNT = :branchName,
        MODIFIED_DATE = SYSDATE,
        MODIFIED_BY = 'CONTRACTOR_PORTAL'
       WHERE ID = :contractorId`,
      {
        companyName: formData.companyName || null,
        nationalId: formData.nationalId || null,
        economicCode: formData.economicCode || null,
        registrationNumber: formData.registrationNumber || null,
        establishmentDate: formData.establishmentDate || null,
        phone: formData.phone || null,
        fax: formData.fax || null,
        email: formData.email || null,
        website: formData.website || null,
        address: formData.address || null,
        postalCode: formData.postalCode || null,
        accountNumber: formData.accountNumber || null,
        ibanNumber: formData.ibanNumber || null,
        branchName: formData.branchName || null,
        contractorId,
      }
    );

    // Update or insert CEO member
    if (formData.ceoFirstName || formData.ceoLastName) {
      const ceoCheck = await connection.execute(
        `SELECT ID FROM CONTRACTOR_MEMBERS 
         WHERE CONTRACTOR_ID = :contractorId 
         AND POSITION_TITLE = 'CEO'`,
        [contractorId]
      );

      if (ceoCheck.rows && ceoCheck.rows.length > 0) {
        // Update existing CEO
        await connection.execute(
          `UPDATE CONTRACTOR_MEMBERS SET
            FIRST_NAME = :firstName,
            LAST_NAME = :lastName,
            NATIONAL_ID = :nationalId,
            MOBILE = :mobile,
            POSITION_TITLE = 'CEO',
            MODIFIED_DATE = SYSDATE
           WHERE ID = :id`,
          {
            firstName: formData.ceoFirstName || null,
            lastName: formData.ceoLastName || null,
            nationalId: formData.ceoNationalId || null,
            mobile: formData.ceoMobile || null,
            id: ceoCheck.rows[0].ID,
          }
        );
      } else {
        // Insert new CEO
        await connection.execute(
          `INSERT INTO CONTRACTOR_MEMBERS 
           (CONTRACTOR_ID, FIRST_NAME, LAST_NAME, NATIONAL_ID, MOBILE, POSITION_TITLE, IS_ACTIVE, CREATED_DATE)
           VALUES (:contractorId, :firstName, :lastName, :nationalId, :mobile, 'CEO', 1, SYSDATE)`,
          {
            contractorId,
            firstName: formData.ceoFirstName || null,
            lastName: formData.ceoLastName || null,
            nationalId: formData.ceoNationalId || null,
            mobile: formData.ceoMobile || null,
          }
        );
      }
    }

    // Update or insert Representative member
    if (formData.repFirstName || formData.repLastName) {
      const repCheck = await connection.execute(
        `SELECT ID FROM CONTRACTOR_MEMBERS 
         WHERE CONTRACTOR_ID = :contractorId 
         AND POSITION_TITLE = :position`,
        [contractorId, formData.repPosition || 'REPRESENTATIVE']
      );

      if (repCheck.rows && repCheck.rows.length > 0) {
        await connection.execute(
          `UPDATE CONTRACTOR_MEMBERS SET
            FIRST_NAME = :firstName,
            LAST_NAME = :lastName,
            NATIONAL_ID = :nationalId,
            PHONE = :phone,
            EMAIL = :email,
            POSITION_TITLE = :position,
            MODIFIED_DATE = SYSDATE
           WHERE ID = :id`,
          {
            firstName: formData.repFirstName || null,
            lastName: formData.repLastName || null,
            nationalId: formData.repNationalId || null,
            phone: formData.repPhone || null,
            email: formData.repEmail || null,
            position: formData.repPosition || 'REPRESENTATIVE',
            id: repCheck.rows[0].ID,
          }
        );
      } else {
        await connection.execute(
          `INSERT INTO CONTRACTOR_MEMBERS 
           (CONTRACTOR_ID, FIRST_NAME, LAST_NAME, NATIONAL_ID, PHONE, EMAIL, POSITION_TITLE, IS_ACTIVE, CREATED_DATE)
           VALUES (:contractorId, :firstName, :lastName, :nationalId, :phone, :email, :position, 1, SYSDATE)`,
          {
            contractorId,
            firstName: formData.repFirstName || null,
            lastName: formData.repLastName || null,
            nationalId: formData.repNationalId || null,
            phone: formData.repPhone || null,
            email: formData.repEmail || null,
            position: formData.repPosition || 'REPRESENTATIVE',
          }
        );
      }
    }

    await connection.commit();

    return NextResponse.json({
      message: 'پیش‌نویس با موفقیت ذخیره شد',
      success: true,
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
      { error: 'خطا در ذخیره پیش‌نویس' },
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
