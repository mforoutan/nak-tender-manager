import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT 
        ID,
        PROVINCE_CODE,
        PROVINCE_NAME,
        IS_ACTIVE
       FROM BASE_PROVINCE 
       WHERE IS_ACTIVE = 1
       ORDER BY PROVINCE_NAME ASC`
    );

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
        },
        { status: 200 }
      );
    }

    const provinces = (result.rows as any[]).map((row) => ({
      id: row.ID,
      code: row.PROVINCE_CODE,
      name: row.PROVINCE_NAME,
      isActive: row.IS_ACTIVE === 1,
    }));

    return NextResponse.json(
      {
        success: true,
        data: provinces,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get provinces error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لیست استان‌ها" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}
