import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    connection = await getConnection();

    let query = `
      SELECT 
        ID,
        BANK_CODE,
        BANK_NAME,
        IS_ACTIVE
      FROM BASE_BANK
      WHERE 1=1
    `;

    // Filter active banks unless explicitly including inactive
    if (!includeInactive) {
      query += ` AND (IS_ACTIVE = 1 OR IS_ACTIVE IS NULL)`;
    }

    query += ` ORDER BY BANK_NAME`;

    const result = await connection.execute(query);

    const banks = (result.rows || []).map((row: any) => ({
      id: row.ID,
      code: row.BANK_CODE,
      name: row.BANK_NAME,
      isActive: row.IS_ACTIVE === 1,
    }));

    return NextResponse.json(banks);
  } catch (error) {
    console.error("Error fetching banks:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لیست بانک‌ها" },
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
