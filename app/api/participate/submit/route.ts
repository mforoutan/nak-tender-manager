import { NextRequest, NextResponse } from "next/server";
import { query, getConnection } from "@/lib/db";
import { getSession } from "@/lib/auth";
import oracledb from "oracledb";

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
        
        connection = await getConnection();
        
        // Get process ID
        const processSql = `
            SELECT ID 
            FROM PUBLISHED_PROCESSES 
            WHERE PUBLICATION_NUMBER = :pubNum
                AND IS_ACTIVE = 1
        `;
        
        const processResult = await connection.execute(processSql, {
            pubNum: publicationNumber
        }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        if (!processResult.rows || processResult.rows.length === 0) {
            return NextResponse.json(
                { error: "مناقصه مورد نظر یافت نشد" },
                { status: 404 }
            );
        }
        
        const publishedProcessId = (processResult.rows as any[])[0].ID;
        
        // Check if already submitted
        const checkSql = `
            SELECT ID 
            FROM PROCESS_SUBMISSION 
            WHERE PUBLISHED_PROCESSES_ID = :processId
                AND CONTRACTOR_ID = :contractorId
        `;
        
        const existingSubmission = await connection.execute(checkSql, {
            processId: publishedProcessId,
            contractorId: session.contractorId
        }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        if (existingSubmission.rows && existingSubmission.rows.length > 0) {
            return NextResponse.json(
                { error: "قبلاً درخواست خود را ارسال کرده‌اید" },
                { status: 400 }
            );
        }
        
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
                :processId,
                :contractorId,
                'PENDING',
                SYSDATE,
                SYSDATE,
                :createdBy
            )
        `;
        
        await connection.execute(insertSubmissionSql, {
            processId: publishedProcessId,
            contractorId: session.contractorId,
            createdBy: session.username
        });
        
        // Get the newly created submission ID
        const getIdSql = `
            SELECT ID 
            FROM PROCESS_SUBMISSION 
            WHERE PUBLISHED_PROCESSES_ID = :processId
                AND CONTRACTOR_ID = :contractorId
                AND ROWNUM = 1
            ORDER BY CREATED_DATE DESC
        `;
        
        const submissionResult = await connection.execute(getIdSql, {
            processId: publishedProcessId,
            contractorId: session.contractorId
        }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        const submissionId = (submissionResult.rows as any[])[0].ID;
        
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
                            :submissionId,
                            :fileId,
                            :docTypeId,
                            'SUBMITTED',
                            SYSDATE,
                            :uploadedBy
                        )
                    `;
                    
                    await connection.execute(insertDocSql, {
                        submissionId: submissionId,
                        fileId: (data as any).fileId,
                        docTypeId: docId,
                        uploadedBy: session.username
                    });
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
