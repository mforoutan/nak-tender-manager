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
    const entityType = data.get('entityType') as string;
    const entityId = data.get('entityId') as string;
    const uploadedBy = data.get('uploadedBy') as string || 'SYSTEM';
    
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

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max by default, can be customized)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "حجم فایل نباید بیشتر از 5 مگابایت باشد" },
        { status: 400 }
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

    connection = await getConnection();
    
    try {
      // Insert file record into FILE_STORE
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
          entityType,
          entityId,
          uploadedBy,
          fileId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        }
      );
      
      const fileId = fileResult.outBinds.fileId[0];
      
      await connection.commit();
      
      return NextResponse.json({
        success: true,
        fileId,
        fileName,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        path: `/uploads/${fileName}`,
        message: 'فایل با موفقیت بارگذاری شد'
      });
      
    } catch (dbError) {
      console.error("Database error during upload:", dbError);
      await connection.rollback();
      
      // Delete the physical file if database insert failed
      try {
        await unlink(filePath);
      } catch (unlinkError) {
        console.error('Error deleting file after failed DB insert:', unlinkError);
      }
      
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
