import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { ContractorFormData } from "@/types";
import oracledb from "oracledb";

export async function POST(req: Request) {
  const connection = await getConnection();
  
  try {
    // Start transaction
    await connection.execute(`BEGIN`);
    
    const formData = await req.json();
    
    // Validate required fields
    if (!formData.companyName) {
      return NextResponse.json(
        { error: "نام شرکت الزامی است" },
        { status: 400 }
      );
    }

    // Always use the fixed contractor ID (301)
    const contractorId = 301;
    const ceoName = `${formData.ceoFirstName || ''} ${formData.ceoLastName || ''}`.trim();
    
    // Update the existing contractor
    await connection.execute(
      `UPDATE CONTRACTORS SET 
       COMPANY_NAME = :companyName, 
       NATIONAL_ID = :nationalId,
       ECONOMIC_CODE = :economicCode,
       REGISTRATION_NUMBER = :registrationNumber,
       ESTABLISHMENT_DATE = :establishmentDate,
       CEO_NAME = :ceoName,
       PHONE = :phone,
       EMAIL = :email,
       FAX = :fax,
       WEBSITE = :website,
       STATUS = :status
       WHERE ID = :id`,
      {
        companyName: formData.companyName,
        nationalId: formData.nationalId || null,
        economicCode: formData.economicCode || null,
        registrationNumber: formData.registrationNumber || null,
        establishmentDate: formData.establishmentDate ? new Date(formData.establishmentDate) : null,
        ceoName: ceoName || null,
        phone: formData.phone || null,
        email: formData.email || null,
        fax: formData.fax || null,
        website: formData.website || null,
        status: 'SUBMITTED', // Mark as submitted
        id: contractorId
      }
    );

    // Create a task for reviewing the contractor registration
    const taskDescription = `
      اطلاعات شرکت: ${formData.companyName}
      نام مدیرعامل: ${ceoName}
      شماره ثبت: ${formData.registrationNumber || 'وارد نشده'}
      کد اقتصادی: ${formData.economicCode || 'وارد نشده'}
      کد ملی: ${formData.nationalId || 'وارد نشده'}
      شماره تماس: ${formData.phone || 'وارد نشده'}
      ایمیل: ${formData.email || 'وارد نشده'}
    `;

    await connection.execute(
      `INSERT INTO TASK (
        ENTITY_TYPE,
        ENTITY_ID,
        ITEM_TYPE,
        TITLE,
        DESCRIPTION,
        STATUS,
        PRIORITY
      ) VALUES (
        :entityType,
        :entityId,
        :itemType,
        :title,
        :description,
        :status,
        :priority
      )`,
      {
        entityType: 'CONTRACTOR',
        entityId: contractorId,
        itemType: 'REGISTRATION_REVIEW',
        title: `بررسی اطلاعات پیمانکار: ${formData.companyName}`,
        description: taskDescription,
        status: 'PENDING',
        priority: 'MEDIUM'
      }
    );

    // Commit transaction
    await connection.execute(`COMMIT`);
    
    return NextResponse.json({
      success: true,
      message: "اطلاعات با موفقیت ثبت شد و برای بررسی به کارشناس ارسال گردید",
      contractorId
    });
  } catch (error) {
    // Rollback in case of error
    await connection.execute(`ROLLBACK`);
    
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: "خطا در ثبت اطلاعات. لطفا مجددا تلاش کنید." },
      { status: 500 }
    );
  } finally {
    await connection.close();
  }
}
