import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import crypto from 'crypto';
import oracledb from "oracledb";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    const documentType = data.get('documentType') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: "فایل انتخاب نشده است" },
        { status: 400 }
      );
    }
    
    // Always use the fixed contractor ID (301)
    const contractorId = 301;
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}_${file.name}`;
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
    
    const connection = await getConnection();
    
    // First store the file
    const fileResult = await connection.execute(
      `INSERT INTO FILE_STORE (
        FILE_NAME,
        ORIGINAL_NAME,
        MIME_TYPE,
        FILE_SIZE,
        FILE_CONTENT,
        FILE_HASH,
        ENTITY_TYPE
      ) VALUES (
        :fileName,
        :originalName,
        :mimeType,
        :fileSize,
        :fileContent,
        :fileHash,
        :entityType
      ) RETURNING ID INTO :id`,
      {
        fileName,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        fileContent: buffer,
        fileHash: fileHash,
        entityType: 'CONTRACTOR_DOC',
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    
    const fileId = fileResult.outBinds.id[0];
    
    // Map document type to certificate information
    let certificateName = '';
    let certificateType = '';
    
    switch(documentType) {
      case 'registration':
        certificateName = 'اساسنامه شرکت';
        certificateType = 'LEGAL';
        break;
      case 'newspaper':
        certificateName = 'روزنامه رسمی';
        certificateType = 'LEGAL';
        break;
      case 'tax':
        certificateName = 'گواهی مالیاتی';
        certificateType = 'TAX';
        break;
      case 'certificate':
        certificateName = 'گواهینامه صلاحیت';
        certificateType = 'QUALIFICATION';
        break;
    }
    
    // Try to add entry to certificates table
    try {
      await connection.execute(
        `INSERT INTO CONTRACTOR_CERTIFICATES (
          CONTRACTOR_ID,
          CERTIFICATE_NAME,
          CERTIFICATE_TYPE,
          ISSUING_ORGANIZATION,
          ISSUE_DATE
        ) VALUES (
          :contractorId,
          :certificateName,
          :certificateType,
          :issuingOrg,
          SYSDATE
        )`,
        {
          contractorId,
          certificateName,
          certificateType,
          issuingOrg: 'آپلود کاربر',
        }
      );
    } catch (certError) {
      console.log("Could not add certificate record:", certError.message);
      // Continue even if certificate record creation fails
    }
    
    await connection.close();
    
    return NextResponse.json({
      success: true,
      message: "فایل با موفقیت بارگذاری شد",
      fileName: fileName,
      fileId: fileId
    });
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "خطا در بارگذاری فایل. لطفا مجددا تلاش کنید." },
      { status: 500 }
    );
  }
}