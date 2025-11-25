import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET /api/participate/process-data
 * Fetches process details and required documents for participation
 * 
 * Query Parameters:
 * - publicationNumber: Publication number of the process
 * 
 * Returns process data including type, title, required documents, and pricing
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publicationNumber = searchParams.get("publicationNumber");

    // Verify session
    const session = await getSession();
    if (!session?.contractorId) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    // Validate input
    if (!publicationNumber) {
      return NextResponse.json(
        { error: "شماره انتشار الزامی است" },
        { status: 400 }
      );
    }

    // Get process details including type
    const processSql = `
      SELECT 
        tp.ID,
        tp.PROCESS_TYPE_ID,
        pp.PUBLICATION_NUMBER,
        tpt.TYPE_NAME,
        pp.TITLE,
        pp.DOCUMENT_PRICE
      FROM PUBLISHED_PROCESSES pp
      JOIN TRANSACTION_PROCESSES tp ON pp.TRANSACTION_PROCESSES_ID = tp.ID
      LEFT JOIN TRANSACTION_PROCESS_TYPES tpt ON tp.PROCESS_TYPE_ID = tpt.ID
      WHERE pp.PUBLICATION_NUMBER = :publicationNumber1
        AND pp.IS_ACTIVE = 1
    `;
    const processResult = await query(processSql, [publicationNumber]);

    if (!processResult || processResult.length === 0) {
      return NextResponse.json(
        { error: "فرآیند مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    const process = processResult[0];

    // Get required documents for this process type
    const documentsSql = `
      SELECT 
        ID,
        DOC_NAME,
        SUBMISSION_TYPE,
        IS_MANDATORY
      FROM REQUIRED_PROCESS_DOCUMENTS
      WHERE PROCESS_TYPE_ID = :processTypeId1
      ORDER BY ID
    `;
    const documentsResult = await query(documentsSql, [process.PROCESS_TYPE_ID]);

    const mappedDocuments = documentsResult.map((doc: any) => ({
      id: doc.ID,
      docName: doc.DOC_NAME,
      submissionType: doc.SUBMISSION_TYPE,
      isMandatory: doc.IS_MANDATORY === 1,
    }));

    return NextResponse.json({
      success: true,
      data: {
        processId: process.ID,
        processType: process.TYPE_NAME,
        publicationNumber: process.PUBLICATION_NUMBER,
        title: process.TITLE,
        requiredDocuments: mappedDocuments,
        documentPrice: process.DOCUMENT_PRICE,
      },
    });
  } catch (error) {
    console.error("Error fetching process data:", error);
    return NextResponse.json(
      {
        error: "خطا در دریافت اطلاعات فرآیند",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
