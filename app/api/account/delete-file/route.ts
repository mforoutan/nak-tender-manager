import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from 'fs';

export async function POST(req: Request) {
  let connection;
  try {
    const data = await req.json();
    const { documentType, contractorId } = data;
    
    if (!contractorId || !documentType) {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // Check if contractor can delete (no pending/completed task)
    const taskCheck = await connection.execute(
      `SELECT STATUS FROM TASKS 
       WHERE ENTITY_TYPE = 'CONTRACTOR' 
       AND ENTITY_ID = :contractorId 
       AND STATUS IN ('PENDING', 'COMPLETED')
       ORDER BY ACTION_DATE DESC
       FETCH FIRST 1 ROWS ONLY`,
      [contractorId]
    );

    if (taskCheck.rows && taskCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'امکان حذف مدرک وجود ندارد. فرم در حال بررسی است.' },
        { status: 403 }
      );
    }

    // Map document type to certificate type
    let certificateType = 'OTHER';
    let certificateName = '';
    
    switch (documentType) {
      case 'registration':
        certificateType = 'LEGAL';
        certificateName = 'اساسنامه شرکت';
        break;
      case 'newspaper':
        certificateType = 'LEGAL';
        certificateName = 'روزنامه رسمی';
        break;
      case 'tax':
        certificateType = 'TAX';
        certificateName = 'گواهی مالیاتی';
        break;
      case 'certificate':
        certificateType = 'QUALIFICATION';
        certificateName = 'گواهینامه صلاحیت';
        break;
    }

    try {
      // Find the certificate and file
      const certificateResult = await connection.execute(
        `SELECT cc.ID, cc.CERTIFICATE_FILE_ID, fs.FILE_NAME
         FROM CONTRACTOR_CERTIFICATES cc
         LEFT JOIN FILE_STORE fs ON cc.CERTIFICATE_FILE_ID = fs.ID
         WHERE cc.CONTRACTOR_ID = :contractorId 
         AND cc.CERTIFICATE_TYPE = :certificateType
         AND cc.CERTIFICATE_NAME = :certificateName
         AND cc.IS_ACTIVE = 1`,
        {
          contractorId,
          certificateType,
          certificateName
        }
      );

      if (!certificateResult.rows || certificateResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'فایلی برای حذف یافت نشد' },
          { status: 404 }
        );
      }

      const certificate = certificateResult.rows[0];
      const fileId = certificate.CERTIFICATE_FILE_ID;
      const fileName = certificate.FILE_NAME;

      // Mark certificate as inactive
      await connection.execute(
        `UPDATE CONTRACTOR_CERTIFICATES 
         SET IS_ACTIVE = 0,
             MODIFIED_DATE = SYSDATE
         WHERE ID = :certId`,
        { certId: certificate.ID }
      );

      // Mark file as deleted
      if (fileId) {
        await connection.execute(
          `UPDATE FILE_STORE 
           SET ENTITY_TYPE = 'DELETED'
           WHERE ID = :fileId`,
          { fileId }
        );
      }

      await connection.commit();

      // Delete physical file if exists
      if (fileName) {
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
        if (existsSync(filePath)) {
          try {
            await unlink(filePath);
          } catch (fileError) {
            console.error('Error deleting physical file:', fileError);
            // Continue anyway, database is already updated
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'فایل با موفقیت حذف شد'
      });
      
    } catch (dbError) {
      console.error("Database error during delete:", dbError);
      await connection.rollback();
      throw dbError;
    }
    
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "خطا در حذف فایل. لطفا مجددا تلاش کنید." },
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
