import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import type { DatabaseRow } from "@/types";

export async function GET(request: NextRequest) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const search = searchParams.get("search");

    connection = await getConnection();

    let query = `
      SELECT 
        ID,
        ACTIVITY_CODE,
        ACTIVITY_NAME,
        DESCRIPTION,
        IS_ACTIVE
      FROM BASE_CONTRACTOR_ACTIVITY
      WHERE 1=1
    `;

    const bindParams: Record<string, unknown> = {};

    // Filter active activities unless explicitly including inactive
    if (!includeInactive) {
      query += ` AND (IS_ACTIVE = 1 OR IS_ACTIVE IS NULL)`;
    }

    // Search filter
    if (search && search.trim() !== "") {
      query += ` AND (ACTIVITY_NAME LIKE :search OR ACTIVITY_CODE LIKE :search OR DESCRIPTION LIKE :search)`;
      bindParams.search = `%${search}%`;
    }

    query += ` ORDER BY ACTIVITY_NAME`;

    const result = await connection.execute(query, bindParams);

    const activities = (result.rows || []).map((row: DatabaseRow) => ({
      id: row.ID,
      code: row.ACTIVITY_CODE,
      name: row.ACTIVITY_NAME,
      description: row.DESCRIPTION,
      isActive: row.IS_ACTIVE === 1,
    }));

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching contractor activities:", error);
    return NextResponse.json(
      { error: "خطا در دریافت فعالیت‌های پیمانکاری" },
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
