import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import oracledb from 'oracledb';
import { v4 as uuidv4 } from 'uuid';
import path from "path";

export async function POST(req: Request) {
  let connection;
  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    const documentType = data.get('documentType') as string;
    const contractorId = data.get('contractorId') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: "فایلی انتخاب نشده است" },
        { status: 400 }
      );
    }

    if (!file.size || file.size === 0) {
      return NextResponse.json(
        { error: "فایل خالی است" },
        { status: 400 }
      );
    }

    if (!contractorId) {
      return NextResponse.json(
        { error: "شناسه پیمانکار مشخص نیست" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "حجم فایل نباید بیشتر از 5 مگابایت باشد" },
        { status: 400 }
      );
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "فرمت فایل باید PDF یا JPG باشد" },
        { status: 400 }
      );
    }

    connection = await getConnection();

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
        { error: 'امکان بارگذاری مدرک وجود ندارد. فرم در حال بررسی است.' },
        { status: 403 }
      );
    }

    // Get file as buffer to store as BLOB
    const fileBytes = await file.arrayBuffer();
    const buffer = Buffer.from(fileBytes);
    
    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;

    let certificateType = 'OTHER';
    let certificateName = file.name;
    
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
      const existingDoc = await connection.execute(
        `SELECT cc.ID, cc.CERTIFICATE_FILE_ID 
         FROM CONTRACTOR_CERTIFICATES cc
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

      let fileId;

      if (existingDoc.rows && existingDoc.rows.length > 0) {
        const oldFileId = existingDoc.rows[0].CERTIFICATE_FILE_ID;
        
        // Insert new file with BLOB data
        const fileResult = await connection.execute(
          `INSERT INTO FILE_STORE (
            FILE_NAME,
            FILE_CONTENT,
            ORIGINAL_NAME, 
            MIME_TYPE, 
            FILE_SIZE,
            ENTITY_TYPE,
            ENTITY_ID,
            UPLOADED_BY
          ) VALUES (
            :fileName,
            :fileContent,
            :originalName,
            :mimeType,
            :fileSize,
            :entityType,
            :entityId,
            :uploadedBy
          ) RETURNING ID INTO :fileId`,
          {
            fileName,
            fileContent: buffer,
            originalName: file.name,
            mimeType: file.type,
            fileSize: file.size,
            entityType: 'CONTRACTOR_DOC',
            entityId: contractorId,
            uploadedBy: 'CONTRACTOR_PORTAL',
            fileId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
          }
        );
        
        fileId = fileResult.outBinds.fileId[0];
        
        await connection.execute(
          `UPDATE CONTRACTOR_CERTIFICATES 
           SET CERTIFICATE_FILE_ID = :fileId,
               MODIFIED_DATE = SYSDATE
           WHERE ID = :certId`,
          {
            fileId,
            certId: existingDoc.rows[0].ID
          }
        );
        
        if (oldFileId) {
          await connection.execute(
            `UPDATE FILE_STORE 
             SET ENTITY_TYPE = 'DELETED'
             WHERE ID = :oldFileId`,
            { oldFileId }
          );
        }
      } else {
        // Insert new file with BLOB data
        const fileResult = await connection.execute(
          `INSERT INTO FILE_STORE (
            FILE_NAME,
            FILE_CONTENT,
            ORIGINAL_NAME, 
            MIME_TYPE, 
            FILE_SIZE,
            ENTITY_TYPE,
            ENTITY_ID,
            UPLOADED_BY
          ) VALUES (
            :fileName,
            :fileContent,
            :originalName,
            :mimeType,
            :fileSize,
            :entityType,
            :entityId,
            :uploadedBy
          ) RETURNING ID INTO :fileId`,
          {
            fileName,
            fileContent: buffer,
            originalName: file.name,
            mimeType: file.type,
            fileSize: file.size,
            entityType: 'CONTRACTOR_DOC',
            entityId: contractorId,
            uploadedBy: 'CONTRACTOR_PORTAL',
            fileId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
          }
        );
        
        fileId = fileResult.outBinds.fileId[0];
        
        await connection.execute(
          `INSERT INTO CONTRACTOR_CERTIFICATES (
            CONTRACTOR_ID,
            CERTIFICATE_NAME,
            CERTIFICATE_TYPE,
            ISSUING_ORGANIZATION,
            ISSUE_DATE,
            CERTIFICATE_FILE_ID,
            IS_ACTIVE
          ) VALUES (
            :contractorId,
            :certificateName,
            :certificateType,
            :issuingOrg,
            SYSDATE,
            :fileId,
            1
          )`,
          {
            contractorId,
            certificateName,
            certificateType,
            issuingOrg: 'آپلود توسط پیمانکار',
            fileId
          }
        );
      }
      
      await connection.commit();
      
      return NextResponse.json({
        success: true,
        fileId,
        fileName,
        originalName: file.name,
        fileSize: file.size,
        documentType,
        message: 'فایل با موفقیت بارگذاری شد'
      });
      
    } catch (dbError) {
      console.error("Database error during upload:", dbError);
      await connection.rollback();
      throw dbError;
    }
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "خطا در آپلود فایل. لطفا مجددا تلاش کنید." },
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