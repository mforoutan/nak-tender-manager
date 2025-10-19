import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const contractorId = url.searchParams.get('id') || "301"; // Default to 301 if not provided
    
    const connection = await getConnection();
    
    // Get contractor information
    const contractorResult = await connection.execute(
      `SELECT * FROM CONTRACTORS WHERE ID = :contractorId`,
      { contractorId }
    );
    
    // Get contractor documents
    const documentsResult = await connection.execute(
      `SELECT CD.*, FS.ORIGINAL_NAME, FS.FILE_SIZE 
       FROM CONTRACTOR_DOCUMENTS CD 
       JOIN FILE_STORE FS ON CD.FILE_ID = FS.ID
       WHERE CD.CONTRACTOR_ID = :contractorId`,
      { contractorId }
    );
    
    await connection.close();
    
    if (contractorResult.rows && contractorResult.rows.length > 0) {
      return NextResponse.json({
        success: true,
        contractor: contractorResult.rows[0],
        documents: documentsResult.rows || []
      });
    } else {
      return NextResponse.json(
        { error: "پیمانکار یافت نشد" },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error("Error fetching contractor profile:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات پیمانکار" },
      { status: 500 }
    );
  }
}