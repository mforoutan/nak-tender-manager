import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET /api/evaluation-forms/[processId]
 * Fetches evaluation form templates and criteria for a specific process
 * 
 * Query Parameters:
 * - publicationNumber: Publication number to fetch forms for
 * 
 * Returns:
 * {
 *   success: true,
 *   data: {
 *     processId: number,
 *     processTitle: string,
 *     templates: [
 *       {
 *         id: number,
 *         templateCode: string,
 *         templateName: string,
 *         templateDescription: string,
 *         evaluationType: string,
 *         totalMaxScore: number,
 *         displayOrder: number,
 *         guidelines: string,
 *         instructions: string,
 *         criteria: [
 *           {
 *             id: number,
 *             criteriaCode: string,
 *             criteriaTitle: string,
 *             criteriaDescription: string,
 *             displayOrder: number,
 *             inputType: string,
 *             isRequired: boolean,
 *             validationRules: object,
 *             predefinedOptions: object,
 *             helpText: string,
 *             evaluationGuide: string
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ processId: string }> }
) {
  try {
    const { processId } = await context.params;
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

    // Get process information and verify it exists
    const processSql = `
      SELECT 
        tp.ID,
        tp.PROCESS_TYPE_ID,
        pp.TITLE,
        pp.STATUS,
        pp.IS_ACTIVE
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

    // Check if contractor has purchased documents (authorization check)
    const purchaseCheckSql = `
      SELECT COUNT(*) as PURCHASE_COUNT
      FROM PAYMENT_TRANSACTION pt
      WHERE pt.CONTRACTOR_ID = :contractorId1
        AND pt.PUBLICATION_NUMBER = :publicationNumber2
        AND pt.STATUS = 'COMPLETED'
    `;

    const purchaseResult = await query(purchaseCheckSql, [
      session.contractorId,
      publicationNumber,
    ]);

    const hasPurchased = purchaseResult[0]?.PURCHASE_COUNT > 0;

    if (!hasPurchased) {
      return NextResponse.json(
        { error: "برای دسترسی به فرم های ارزیابی، ابتدا باید اسناد مناقصه را خریداری کنید" },
        { status: 403 }
      );
    }

    // Get evaluation templates assigned to this process
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
        evt.TYPE_NAME as EVALUATION_TYPE_NAME,
        evt.TYPE_CODE as EVALUATION_TYPE_CODE,
        pe.ID as PROCESS_EVALUATION_ID,
        pe.STATUS as EVALUATION_STATUS,
        pe.DUE_DATE,
        pe.MINIMUM_REQUIRED_SCORE,
        pe.IS_MANDATORY
      FROM EVALUATION_TEMPLATES et
      JOIN EVALUATION_TYPES evt ON et.EVALUATION_TYPE_ID = evt.ID
      LEFT JOIN PROCESS_EVALUATIONS pe ON et.ID = pe.EVALUATION_TEMPLATE_ID 
        AND pe.TRANSACTION_PROCESS_ID = :transactionProcessId1
      WHERE et.IS_ACTIVE = 1
        AND evt.IS_ACTIVE = 1
      ORDER BY et.DISPLAY_ORDER
    `;

    const templates = await query(templatesSql, [transactionProcessId]);

    // If no templates assigned to this specific process, return all active templates
    // This allows contractors to see evaluation forms even if admin hasn't explicitly assigned them
    const templatesData = templates.length > 0 ? templates : await query(`
      SELECT 
        et.ID,
        et.TEMPLATE_CODE,
        et.TEMPLATE_NAME,
        et.TEMPLATE_DESCRIPTION,
        et.TOTAL_MAX_SCORE,
        et.DISPLAY_ORDER,
        et.EVALUATION_GUIDELINES,
        et.COMPLETION_INSTRUCTIONS,
        evt.TYPE_NAME as EVALUATION_TYPE_NAME,
        evt.TYPE_CODE as EVALUATION_TYPE_CODE,
        NULL as PROCESS_EVALUATION_ID,
        'AVAILABLE' as EVALUATION_STATUS,
        NULL as DUE_DATE,
        NULL as MINIMUM_REQUIRED_SCORE,
        1 as IS_MANDATORY
      FROM EVALUATION_TEMPLATES et
      JOIN EVALUATION_TYPES evt ON et.EVALUATION_TYPE_ID = evt.ID
      WHERE et.IS_ACTIVE = 1
        AND evt.IS_ACTIVE = 1
      ORDER BY et.DISPLAY_ORDER
    `, []);

    // Get criteria for all templates
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
        ec.ALLOW_CUSTOM_INPUT,
        ec.HELP_TEXT,
        ec.EVALUATION_GUIDE
      FROM EVALUATION_CRITERIA ec
      WHERE ec.TEMPLATE_ID IN (
        SELECT ID FROM EVALUATION_TEMPLATES WHERE IS_ACTIVE = 1
      )
      AND ec.IS_ACTIVE = 1
      ORDER BY ec.TEMPLATE_ID, ec.DISPLAY_ORDER
    `;

    const allCriteria = await query(criteriaSql, []);

    // Get contractor's existing responses if any
    const responsesSql = `
      SELECT 
        er.ID,
        er.EVALUATION_CRITERIA_ID,
        er.RESPONSE_VALUE,
        er.RESPONSE_TEXT,
        er.RESPONSE_SCORE,
        er.RESPONSE_FILE_ID,
        er.RESPONSE_FOLDER_ID,
        er.RESPONSE_DATE,
        er.STATUS,
        fs.FILE_NAME,
        fs.ORIGINAL_NAME,
        fs.FILE_SIZE,
        fs.MIME_TYPE
      FROM EVALUATION_RESPONSES er
      LEFT JOIN FILE_STORE fs ON er.RESPONSE_FILE_ID = fs.ID
      WHERE er.PROCESS_EVALUATION_ID IN (
        SELECT ID FROM PROCESS_EVALUATIONS 
        WHERE TRANSACTION_PROCESS_ID = :transactionProcessId2
      )
      AND er.RESPONDENT_CONTRACTOR_ID = :contractorId2
    `;

    const responses = await query(responsesSql, [
      transactionProcessId,
      session.contractorId,
    ]);

    // Group criteria by template and attach responses
    const templatesWithCriteria = templatesData.map((template: any) => {
      const templateCriteria = allCriteria
        .filter((c: any) => c.TEMPLATE_ID === template.ID)
        .map((criterion: any) => {
          // Find existing response for this criterion
          const existingResponse = responses.find(
            (r: any) => r.EVALUATION_CRITERIA_ID === criterion.ID
          );

          return {
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
            allowCustomInput: criterion.ALLOW_CUSTOM_INPUT === 1,
            helpText: criterion.HELP_TEXT,
            evaluationGuide: criterion.EVALUATION_GUIDE,
            // Existing response data
            response: existingResponse
              ? {
                  id: existingResponse.ID,
                  value: existingResponse.RESPONSE_VALUE,
                  text: existingResponse.RESPONSE_TEXT,
                  score: existingResponse.RESPONSE_SCORE,
                  fileId: existingResponse.RESPONSE_FILE_ID,
                  folderId: existingResponse.RESPONSE_FOLDER_ID,
                  date: existingResponse.RESPONSE_DATE,
                  status: existingResponse.STATUS,
                  file: existingResponse.FILE_NAME
                    ? {
                        name: existingResponse.ORIGINAL_NAME,
                        size: existingResponse.FILE_SIZE,
                        type: existingResponse.MIME_TYPE,
                      }
                    : null,
                }
              : null,
          };
        });

      return {
        id: template.ID,
        templateCode: template.TEMPLATE_CODE,
        templateName: template.TEMPLATE_NAME,
        templateDescription: template.TEMPLATE_DESCRIPTION,
        evaluationType: template.EVALUATION_TYPE_NAME,
        evaluationTypeCode: template.EVALUATION_TYPE_CODE,
        totalMaxScore: template.TOTAL_MAX_SCORE,
        displayOrder: template.DISPLAY_ORDER,
        guidelines: template.EVALUATION_GUIDELINES,
        instructions: template.COMPLETION_INSTRUCTIONS,
        processEvaluationId: template.PROCESS_EVALUATION_ID,
        evaluationStatus: template.EVALUATION_STATUS,
        dueDate: template.DUE_DATE,
        minimumRequiredScore: template.MINIMUM_REQUIRED_SCORE,
        isMandatory: template.IS_MANDATORY === 1,
        criteria: templateCriteria,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        processId: transactionProcessId,
        processTitle: process.TITLE,
        publicationNumber: publicationNumber,
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
