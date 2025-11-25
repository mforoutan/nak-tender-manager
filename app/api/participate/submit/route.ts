import { NextRequest, NextResponse } from "next/server";
import { query, getConnection } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    let connection;
    
    try {
        const session = await getSession();
        
        if (!session?.contractorId) {
            return NextResponse.json(
                { error: "لطفا وارد سیستم شوید" },
                { status: 401 }
            );
        }
        
        const body = await request.json();
        const { publicationNumber, documentData } = body;
        
        if (!publicationNumber) {
            return NextResponse.json(
                { error: "شماره انتشار مناقصه الزامی است" },
                { status: 400 }
            );
        }
        
        // Get process ID
        const processSql = `
            SELECT ID 
            FROM PUBLISHED_PROCESSES 
            WHERE PUBLICATION_NUMBER = :pubNum1
                AND IS_ACTIVE = 1
        `;
        
        const processResult = await query(processSql, [publicationNumber]);
        
        if (!processResult || processResult.length === 0) {
            return NextResponse.json(
                { error: "مناقصه مورد نظر یافت نشد" },
                { status: 404 }
            );
        }
        
        const publishedProcessId = processResult[0].ID;
        
        // Check if already submitted
        const checkSql = `
            SELECT ID 
            FROM PROCESS_SUBMISSION 
            WHERE PUBLISHED_PROCESSES_ID = :processId1
                AND CONTRACTOR_ID = :contractorId1
        `;
        
        const existingSubmission = await query(checkSql, [
            publishedProcessId,
            session.contractorId
        ]);
        
        if (existingSubmission && existingSubmission.length > 0) {
            return NextResponse.json(
                { error: "قبلاً درخواست خود را ارسال کرده‌اید" },
                { status: 400 }
            );
        }
        
        connection = await getConnection();
        
        // Create submission
        const insertSubmissionSql = `
            INSERT INTO PROCESS_SUBMISSION (
                ID,
                PUBLISHED_PROCESSES_ID,
                CONTRACTOR_ID,
                STATUS,
                SUBMISSION_DATE,
                CREATED_DATE,
                CREATED_BY
            ) VALUES (
                PROCESS_SUBMISSION_SEQ.NEXTVAL,
                :processId2,
                :contractorId2,
                'PENDING',
                SYSDATE,
                SYSDATE,
                :createdBy1
            )
        `;
        
        await query(insertSubmissionSql, [
            publishedProcessId,
            session.contractorId,
            session.username
        ]);
        
        // Get the newly created submission ID
        const getIdSql = `
            SELECT ID 
            FROM PROCESS_SUBMISSION 
            WHERE PUBLISHED_PROCESSES_ID = :processId3
                AND CONTRACTOR_ID = :contractorId3
                AND ROWNUM = 1
            ORDER BY CREATED_DATE DESC
        `;
        
        const submissionResult = await query(getIdSql, [
            publishedProcessId,
            session.contractorId
        ]);
        
        const submissionId = submissionResult[0].ID;
        
        // Store document data if provided
        if (documentData && Object.keys(documentData).length > 0) {
            for (const [docId, data] of Object.entries(documentData)) {
                if (data && (data as any).fileId) {
                    const insertDocSql = `
                        INSERT INTO PROCESS_SUBMITTED_DOCUMENTS (
                            ID,
                            PROCESS_SUBMISSION_ID,
                            FILE_STORE_ID,
                            DOCUMENT_TYPE_ID,
                            STATUS,
                            UPLOAD_DATE,
                            UPLOADED_BY
                        ) VALUES (
                            PROCESS_SUBMITTED_DOCUMENTS_SEQ.NEXTVAL,
                            :submissionId1,
                            :fileId1,
                            :docTypeId1,
                            'SUBMITTED',
                            SYSDATE,
                            :uploadedBy1
                        )
                    `;
                    
                    await query(insertDocSql, [
                        submissionId,
                        (data as any).fileId,
                        docId,
                        session.username
                    ]);
                }
            }
        }
        
        await connection.commit();
        
        return NextResponse.json({
            success: true,
            message: "درخواست شما با موفقیت ارسال شد",
            submissionId: submissionId
        });
        
    } catch (error) {
        console.error("Error submitting participation:", error);
        await connection?.rollback();
        
        return NextResponse.json(
            { error: "خطا در ارسال درخواست" },
            { status: 500 }
        );
    } finally {
        await connection?.close();
    }
}
