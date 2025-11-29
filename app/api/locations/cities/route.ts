import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import type { DatabaseRow } from "@/types";

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const provinceId = searchParams.get("provinceId");

    if (!provinceId) {
      return NextResponse.json(
        { error: "شناسه استان الزامی است" },
        { status: 400 }
      );
    }

    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT 
        ID,
        CITY_CODE,
        CITY_NAME,
        PROVINCE_ID,
        IS_ACTIVE
       FROM BASE_CITY 
       WHERE PROVINCE_ID = :provinceId 
         AND IS_ACTIVE = 1
       ORDER BY CITY_NAME ASC`,
      { provinceId: parseInt(provinceId) }
    );

    const cities = (result.rows as DatabaseRow[]).map((row) => ({
      id: row.ID,
      code: row.CITY_CODE,
      name: row.CITY_NAME,
      provinceId: row.PROVINCE_ID,
      isActive: row.IS_ACTIVE === 1,
    }));

    return NextResponse.json(
      {
        success: true,
        data: cities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get cities error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لیست شهرها" },
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
