import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import oracledb from 'oracledb';
import { existsSync } from 'fs';

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

    // Validate that file is actually a File object with content
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

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "حجم فایل نباید بیشتر از 5 مگابایت باشد" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "فرمت فایل باید PDF یا JPG باشد" },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // Check if contractor can upload (no pending/completed task)
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

    // Get file details
    const fileBytes = await file.arrayBuffer();
    const buffer = Buffer.from(fileBytes);
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, fileName);
    
    // Save file to disk
    await writeFile(filePath, buffer);

    // Map document type to certificate type
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
      // Check if document already exists for this type
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
        // Update existing document
        const oldFileId = existingDoc.rows[0].CERTIFICATE_FILE_ID;
        
        // Insert new file
        const fileResult = await connection.execute(
          `INSERT INTO FILE_STORE (
            FILE_NAME, 
            ORIGINAL_NAME, 
            MIME_TYPE, 
            FILE_SIZE,
            ENTITY_TYPE,
            ENTITY_ID,
            UPLOADED_BY
          ) VALUES (
            :fileName,
            :originalName,
            :mimeType,
            :fileSize,
            :entityType,
            :entityId,
            :uploadedBy
          ) RETURNING ID INTO :fileId`,
          {
            fileName,
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
        
        // Update certificate with new file ID
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
        
        // Optionally, mark old file as inactive or delete it
        if (oldFileId) {
          await connection.execute(
            `UPDATE FILE_STORE 
             SET ENTITY_TYPE = 'DELETED'
             WHERE ID = :oldFileId`,
            { oldFileId }
          );
        }
      } else {
        // Insert new file
        const fileResult = await connection.execute(
          `INSERT INTO FILE_STORE (
            FILE_NAME, 
            ORIGINAL_NAME, 
            MIME_TYPE, 
            FILE_SIZE,
            ENTITY_TYPE,
            ENTITY_ID,
            UPLOADED_BY
          ) VALUES (
            :fileName,
            :originalName,
            :mimeType,
            :fileSize,
            :entityType,
            :entityId,
            :uploadedBy
          ) RETURNING ID INTO :fileId`,
          {
            fileName,
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
        
        // Insert new certificate
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
        fileName,
        originalName: file.name,
        fileSize: file.size,
        documentType,
        path: `/uploads/${fileName}`,
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