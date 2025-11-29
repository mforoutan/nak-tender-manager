import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from 'fs';

export async function POST(req: Request) {
  let connection;
  try {
    const data = await req.json();
    const { fileId } = data;
    
    if (!fileId) {
      return NextResponse.json(
        { error: "شناسه فایل مشخص نیست" },
        { status: 400 }
      );
    }

    connection = await getConnection();

    try {
      // Get file information
      const fileResult = await connection.execute(
        `SELECT FILE_NAME, ENTITY_TYPE 
         FROM FILE_STORE 
         WHERE ID = :fileId`,
        { fileId }
      );

      if (!fileResult.rows || fileResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'فایلی یافت نشد' },
          { status: 404 }
        );
      }

      const file = fileResult.rows[0] as { FILE_NAME: string; ENTITY_TYPE: string };
      const fileName = file.FILE_NAME;

      // Mark file as deleted (soft delete)
      await connection.execute(
        `UPDATE FILE_STORE 
         SET ENTITY_TYPE = 'DELETED'
         WHERE ID = :fileId`,
        { fileId }
      );

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
