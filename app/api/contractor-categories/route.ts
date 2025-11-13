import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");
    const includeInactive = searchParams.get("includeInactive") === "true";

    connection = await getConnection();

    let query = `
      SELECT 
        ID,
        CATEGORY_CODE,
        CATEGORY_NAME,
        DESCRIPTION,
        PARENT_CATEGORY_ID,
        IS_ACTIVE,
        DISPLAY_ORDER
      FROM CONTRACTOR_CATEGORY
      WHERE 1=1
    `;

    const bindParams: any = {};

    // Filter by parent category if specified
    if (parentId !== null) {
      if (parentId === "null" || parentId === "") {
        query += ` AND PARENT_CATEGORY_ID IS NULL`;
      } else {
        query += ` AND PARENT_CATEGORY_ID = :parentId`;
        bindParams.parentId = parseInt(parentId);
      }
    }

    // Filter active categories unless explicitly including inactive
    if (!includeInactive) {
      query += ` AND (IS_ACTIVE = 1 OR IS_ACTIVE IS NULL)`;
    }

    query += ` ORDER BY DISPLAY_ORDER, CATEGORY_NAME`;

    const result = await connection.execute(query, bindParams);

    const categories = (result.rows || []).map((row: any) => ({
      id: row.ID,
      code: row.CATEGORY_CODE,
      name: row.CATEGORY_NAME,
      description: row.DESCRIPTION,
      parentId: row.PARENT_CATEGORY_ID,
      isActive: row.IS_ACTIVE === 1,
      displayOrder: row.DISPLAY_ORDER,
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching contractor categories:", error);
    return NextResponse.json(
      { error: "خطا در دریافت دسته‌بندی‌های پیمانکار" },
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
