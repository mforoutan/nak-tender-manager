import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import oracledb from "oracledb";

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const connection = await getConnection();

    // Always use the fixed contractor ID (301)
    const contractorId = 301;
    const ceoName = `${formData.ceoFirstName || ''} ${formData.ceoLastName || ''}`.trim();
    
    // Update the existing contractor record
    await connection.execute(
      `UPDATE CONTRACTORS SET 
       COMPANY_NAME = :companyName, 
       NATIONAL_ID = :nationalId,
       ECONOMIC_CODE = :economicCode,
       REGISTRATION_NUMBER = :registrationNumber,
       ESTABLISHMENT_DATE = :establishmentDate,
       CEO_NAME = :ceoName,
       PHONE = :phone,
       FAX = :fax
       WHERE ID = :id`,
      {
        companyName: formData.companyName || null,
        nationalId: formData.nationalId || null,
        economicCode: formData.economicCode || null,
        registrationNumber: formData.registrationNumber || null,
        establishmentDate: formData.establishmentDate ? new Date(formData.establishmentDate) : null,
        ceoName: ceoName || null,
        phone: formData.phone || null,
        fax: formData.fax || null,
        id: contractorId
      }
    );

    // Try to update CEO information in CONTRACTOR_MEMBERS table
    try {
      // Check if CEO already exists
      const ceoCheckResult = await connection.execute(
        `SELECT ID FROM CONTRACTOR_MEMBERS 
         WHERE CONTRACTOR_ID = :contractorId AND POSITION_TITLE = 'CEO'`,
        { contractorId }
      );
      
      if (ceoCheckResult.rows && ceoCheckResult.rows.length > 0) {
        // Update existing CEO
        await connection.execute(
          `UPDATE CONTRACTOR_MEMBERS SET
           FIRST_NAME = :firstName,
           LAST_NAME = :lastName,
           NATIONAL_ID = :nationalId,
           PHONE = :phone,
           POSITION_TITLE = :position
           WHERE ID = :id`,
          {
            firstName: formData.ceoFirstName || null,
            lastName: formData.ceoLastName || null,
            nationalId: formData.ceoNationalId || null,
            phone: formData.ceoMobile || null,
            position: formData.ceoPosition || 'CEO',
            id: ceoCheckResult.rows[0].ID
          }
        );
      } else if (formData.ceoFirstName || formData.ceoLastName) {
        // Insert new CEO
        await connection.execute(
          `INSERT INTO CONTRACTOR_MEMBERS (
            CONTRACTOR_ID,
            FIRST_NAME,
            LAST_NAME,
            NATIONAL_ID,
            POSITION_TITLE,
            PHONE
          ) VALUES (
            :contractorId,
            :firstName,
            :lastName,
            :nationalId,
            :position,
            :phone
          )`,
          {
            contractorId,
            firstName: formData.ceoFirstName || null,
            lastName: formData.ceoLastName || null,
            nationalId: formData.ceoNationalId || null,
            position: formData.ceoPosition || 'CEO',
            phone: formData.ceoMobile || null
          }
        );
      }
      
      // Do the same for representative
      if (formData.repFirstName || formData.repLastName) {
        const repCheckResult = await connection.execute(
          `SELECT ID FROM CONTRACTOR_MEMBERS 
           WHERE CONTRACTOR_ID = :contractorId AND POSITION_TITLE = 'Representative'`,
          { contractorId }
        );
        
        if (repCheckResult.rows && repCheckResult.rows.length > 0) {
          // Update existing representative
          await connection.execute(
            `UPDATE CONTRACTOR_MEMBERS SET
             FIRST_NAME = :firstName,
             LAST_NAME = :lastName,
             NATIONAL_ID = :nationalId,
             PHONE = :phone,
             POSITION_TITLE = :position
             WHERE ID = :id`,
            {
              firstName: formData.repFirstName || null,
              lastName: formData.repLastName || null,
              nationalId: formData.repNationalId || null,
              phone: formData.repPhone || null,
              position: formData.repPosition || 'Representative',
              id: repCheckResult.rows[0].ID
            }
          );
        } else {
          // Insert new representative
          await connection.execute(
            `INSERT INTO CONTRACTOR_MEMBERS (
              CONTRACTOR_ID,
              FIRST_NAME,
              LAST_NAME,
              NATIONAL_ID,
              POSITION_TITLE,
              PHONE
            ) VALUES (
              :contractorId,
              :firstName,
              :lastName,
              :nationalId,
              :position,
              :phone
            )`,
            {
              contractorId,
              firstName: formData.repFirstName || null,
              lastName: formData.repLastName || null,
              nationalId: formData.repNationalId || null,
              position: formData.repPosition || 'Representative',
              phone: formData.repPhone || null
            }
          );
        }
      }
    } catch (membersError) {
      console.log("Could not update members:", membersError.message);
      // Continue without failing the entire operation
    }

    await connection.close();
    
    return NextResponse.json({
      success: true,
      message: "پیش‌نویس با موفقیت ذخیره شد",
      contractorId: contractorId
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: "خطا در ذخیره اطلاعات. لطفا مجددا تلاش کنید." },
      { status: 500 }
    );
  }
}
