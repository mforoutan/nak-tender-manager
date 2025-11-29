import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { DatabaseRow } from "@/types";

/**
 * GET /api/participate/evaluation-forms
 * Fetches evaluation form templates and criteria for a process
 * 
 * Query Parameters:
 * - publicationNumber: Publication number of the process
 * 
 * Returns evaluation templates with criteria
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

    // Get process ID and title
    const processSql = `
      SELECT 
        tp.ID,
        pp.TITLE,
        pp.STATUS
      FROM PUBLISHED_PROCESSES pp
      JOIN TRANSACTION_PROCESSES tp ON pp.TRANSACTION_PROCESSES_ID = tp.ID
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
    const transactionProcessId = process.ID;

    // Get evaluation templates
    const templatesSql = `
      SELECT 
        et.ID,
        et.TEMPLATE_CODE,
        et.TEMPLATE_NAME,
        et.TEMPLATE_DESCRIPTION,
        et.TOTAL_MAX_SCORE,
        et.DISPLAY_ORDER,
        et.EVALUATION_GUIDELINES,
        et.COMPLETION_INSTRUCTIONS,
        evt.TYPE_NAME as EVALUATION_TYPE_NAME
      FROM EVALUATION_TEMPLATES et
      JOIN EVALUATION_TYPES evt ON et.EVALUATION_TYPE_ID = evt.ID
      WHERE et.IS_ACTIVE = 1
        AND evt.IS_ACTIVE = 1
      ORDER BY et.DISPLAY_ORDER
    `;
    const templates = await query(templatesSql, []);

    // Get evaluation criteria
    const criteriaSql = `
      SELECT 
        ec.ID,
        ec.TEMPLATE_ID,
        ec.CRITERIA_CODE,
        ec.CRITERIA_TITLE,
        ec.CRITERIA_DESCRIPTION,
        ec.DISPLAY_ORDER,
        ec.INDENT_LEVEL,
        ec.INPUT_TYPE,
        ec.IS_REQUIRED,
        ec.VALIDATION_RULES,
        ec.PREDEFINED_OPTIONS,
        ec.HELP_TEXT,
        ec.EVALUATION_GUIDE
      FROM EVALUATION_CRITERIA ec
      WHERE ec.IS_ACTIVE = 1
      ORDER BY ec.TEMPLATE_ID, ec.DISPLAY_ORDER
    `;
    const allCriteria = await query(criteriaSql, []);

    // Map criteria to templates
    const templatesWithCriteria = templates.map((template: DatabaseRow) => ({
      id: template.ID,
      templateCode: template.TEMPLATE_CODE,
      templateName: template.TEMPLATE_NAME,
      templateDescription: template.TEMPLATE_DESCRIPTION,
      totalMaxScore: template.TOTAL_MAX_SCORE,
      displayOrder: template.DISPLAY_ORDER,
      evaluationGuidelines: template.EVALUATION_GUIDELINES,
      completionInstructions: template.COMPLETION_INSTRUCTIONS,
      evaluationTypeName: template.EVALUATION_TYPE_NAME,
      criteria: allCriteria
        .filter((c: DatabaseRow) => c.TEMPLATE_ID === template.ID)
        .map((criterion: DatabaseRow) => ({
          id: criterion.ID,
          criteriaCode: criterion.CRITERIA_CODE,
          criteriaTitle: criterion.CRITERIA_TITLE,
          criteriaDescription: criterion.CRITERIA_DESCRIPTION,
          displayOrder: criterion.DISPLAY_ORDER,
          indentLevel: criterion.INDENT_LEVEL || 0,
          inputType: criterion.INPUT_TYPE,
          isRequired: criterion.IS_REQUIRED === 1,
          validationRules: criterion.VALIDATION_RULES
            ? JSON.parse(criterion.VALIDATION_RULES)
            : null,
          predefinedOptions: criterion.PREDEFINED_OPTIONS
            ? JSON.parse(criterion.PREDEFINED_OPTIONS)
            : null,
          helpText: criterion.HELP_TEXT,
          evaluationGuide: criterion.EVALUATION_GUIDE,
        })),
    }));

    return NextResponse.json({
      success: true,
      data: {
        processId: transactionProcessId,
        processTitle: process.TITLE,
        processStatus: process.STATUS,
        templates: templatesWithCriteria,
      },
    });
  } catch (error) {
    console.error("Error fetching evaluation forms:", error);
    return NextResponse.json(
      {
        error: "خطا در دریافت اطلاعات فرم های ارزیابی",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
