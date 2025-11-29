import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { TenderListItem, DatabaseRow } from "@/types";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        
        if (!session?.contractorId) {
            return NextResponse.json(
                { error: "لطفا وارد سیستم شوید" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'all';
        const type = searchParams.get('type') || '';
        const endDate = searchParams.get('endDate') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        const whereConditions = [
            "PS.CONTRACTOR_ID = :contractorId1"
        ];
        const params: (string | number)[] = [session.contractorId];
        let paramIndex = 2;

        // Search filter
        if (search) {
            whereConditions.push(`(
                LOWER(PP.TITLE) LIKE LOWER(:param${paramIndex}) OR
                LOWER(PP.PUBLICATION_NUMBER) LIKE LOWER(:param${paramIndex})
            )`);
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Type filter (مناقصه عمومی, استعلام, فراخوان)
        if (type && type !== 'all') {
            whereConditions.push(`TPT.TYPE_NAME = :param${paramIndex}`);
            params.push(type);
            paramIndex++;
        }

        // Status filter based on dates
        const today = new Date().toISOString().split('T')[0];
        if (status === 'ongoing') {
            whereConditions.push(`PP.SUBMISSION_END_DATE >= TO_DATE('${today}', 'YYYY-MM-DD')`);
            whereConditions.push(`PP.SUBMISSION_START_DATE <= TO_DATE('${today}', 'YYYY-MM-DD')`);
        } else if (status === 'upcoming') {
            whereConditions.push(`PP.SUBMISSION_START_DATE > TO_DATE('${today}', 'YYYY-MM-DD')`);
        } else if (status === 'completed') {
            whereConditions.push(`PP.SUBMISSION_END_DATE < TO_DATE('${today}', 'YYYY-MM-DD')`);
        }

        // End date filter
        if (endDate) {
            whereConditions.push(`PP.SUBMISSION_END_DATE <= TO_DATE(:param${paramIndex}, 'YYYY-MM-DD')`);
            params.push(endDate);
            paramIndex++;
        }

        const whereClause = whereConditions.length > 0 
            ? `WHERE ${whereConditions.join(' AND ')}`
            : '';

        // Count query
        const countSql = `
            SELECT COUNT(*) as TOTAL
            FROM PROCESS_SUBMISSION PS
            INNER JOIN PUBLISHED_PROCESSES PP ON PS.PUBLISHED_PROCESSES_ID = PP.ID
            INNER JOIN TRANSACTION_PROCESSES TP ON PP.TRANSACTION_PROCESSES_ID = TP.ID
            INNER JOIN TRANSACTION_PROCESS_TYPES TPT ON TP.PROCESS_TYPE_ID = TPT.ID
            ${whereClause}
        `;

        const countResult = await query(countSql, params);
        const total = (countResult[0] as DatabaseRow)?.TOTAL as number || 0;

        // Data query
        const dataSql = `
            SELECT 
                PP.ID,
                PP.PUBLICATION_NUMBER,
                PP.TITLE,
                PP.SUBMISSION_END_DATE,
                TPT.TYPE_NAME,
                PRC.CATEGORY_NAME,
                PS.STATUS as SUBMISSION_STATUS,
                PS.SUBMISSION_DATE
            FROM PROCESS_SUBMISSION PS
            INNER JOIN PUBLISHED_PROCESSES PP ON PS.PUBLISHED_PROCESSES_ID = PP.ID
            INNER JOIN TRANSACTION_PROCESSES TP ON PP.TRANSACTION_PROCESSES_ID = TP.ID
            INNER JOIN TRANSACTION_PROCESS_TYPES TPT ON TP.PROCESS_TYPE_ID = TPT.ID
            LEFT JOIN PR_REQUEST_CATEGORIES PRC ON TP.PR_REQUEST_CATEGORY_ID = PRC.ID
            ${whereClause}
            ORDER BY PS.SUBMISSION_DATE DESC
            OFFSET :offset${paramIndex} ROWS FETCH NEXT :limit${paramIndex + 1} ROWS ONLY
        `;

        params.push(offset, limit);

        const results = await query(dataSql, params);

        const data: TenderListItem[] = (results as DatabaseRow[]).map((row: DatabaseRow) => {
            const endDate = row.SUBMISSION_END_DATE ? new Date(row.SUBMISSION_END_DATE as string | Date) : null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let itemStatus: 'ongoing' | 'upcoming' | 'completed' = 'completed';
            
            if (endDate) {
                if (endDate >= today) {
                    itemStatus = 'ongoing';
                } else {
                    itemStatus = 'completed';
                }
            }

            // Override status based on submission status if needed
            if (row.SUBMISSION_STATUS === 'APPROVED') {
                itemStatus = 'completed';
            }

            return {
                id: row.ID as number,
                title: (row.TITLE as string) || 'بدون عنوان',
                type: (row.TYPE_NAME as string) || 'نامشخص',
                status: itemStatus,
                endDate: endDate ? endDate.toISOString().split('T')[0] : '',
                category: (row.CATEGORY_NAME as string) || 'عمومی',
                code: (row.PUBLICATION_NUMBER as string) || '',
            };
        });

        return NextResponse.json({
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error("Error fetching submissions:", error);
        return NextResponse.json(
            { error: "خطا در دریافت اطلاعات" },
            { status: 500 }
        );
    }
}
