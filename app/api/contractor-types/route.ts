import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import type { DatabaseRow } from "@/types";

export async function GET(request: NextRequest) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    connection = await getConnection();

    let query = `
      SELECT 
        ID,
        TYPE_CODE,
        TYPE_NAME,
        DESCRIPTION,
        IS_ACTIVE
      FROM BASE_CONTRACTOR_TYPE
      WHERE 1=1
    `;

    // Filter active types unless explicitly including inactive
    if (!includeInactive) {
      query += ` AND (IS_ACTIVE = 1 OR IS_ACTIVE IS NULL)`;
    }

    query += ` ORDER BY TYPE_NAME`;

    const result = await connection.execute(query);

    const types = (result.rows || []).map((row: DatabaseRow) => ({
      id: row.ID,
      code: row.TYPE_CODE,
      name: row.TYPE_NAME,
      description: row.DESCRIPTION,
      isActive: row.IS_ACTIVE === 1,
    }));

    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching contractor types:", error);
    return NextResponse.json(
      { error: "خطا در دریافت انواع پیمانکار" },
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
