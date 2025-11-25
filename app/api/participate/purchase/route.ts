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
        const { publicationNumber, amount } = body;
        
        if (!publicationNumber) {
            return NextResponse.json(
                { error: "شماره انتشار مناقصه الزامی است" },
                { status: 400 }
            );
        }
        
        // Get process ID from publication number
        const processSql = `
            SELECT ID, DOCUMENT_PRICE 
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
        
        const publishedProcess = processResult[0];
        
        // Check if already purchased
        const checkSql = `
            SELECT ID 
            FROM PAYMENT_TRANSACTION 
            WHERE PUBLISHED_PROCESS_ID = :processId1
                AND CONTRACTOR_ID = :contractorId1
                AND PAYMENT_TYPE = 'DOCUMENT_PURCHASE'
                AND STATUS = 'COMPLETED'
        `;
        
        const existingPayment = await query(checkSql, [
            publishedProcess.ID,
            session.contractorId
        ]);
        
        if (existingPayment && existingPayment.length > 0) {
            return NextResponse.json(
                { error: "قبلاً اسناد را خریداری کرده‌اید" },
                { status: 400 }
            );
        }
        
        connection = await getConnection();
        
        // Create payment transaction
        const insertSql = `
            INSERT INTO PAYMENT_TRANSACTION (
                ID,
                PUBLISHED_PROCESS_ID,
                CONTRACTOR_ID,
                PAYMENT_TYPE,
                AMOUNT,
                CURRENCY,
                STATUS,
                PAYMENT_DATE,
                PAYMENT_METHOD,
                CREATED_DATE,
                CREATED_BY
            ) VALUES (
                PAYMENT_TRANSACTION_SEQ.NEXTVAL,
                :processId2,
                :contractorId2,
                'DOCUMENT_PURCHASE',
                :amount1,
                'IRR',
                'COMPLETED',
                SYSDATE,
                'ONLINE',
                SYSDATE,
                :createdBy1
            )
        `;
        
        await query(insertSql, [
            publishedProcess.ID,
            session.contractorId,
            amount || publishedProcess.DOCUMENT_PRICE,
            session.username
        ]);
        
        await connection.commit();
        
        return NextResponse.json({
            success: true,
            message: "پرداخت با موفقیت انجام شد"
        });
        
    } catch (error) {
        console.error("Error processing document purchase:", error);
        await connection?.rollback();
        
        return NextResponse.json(
            { error: "خطا در پردازش پرداخت" },
            { status: 500 }
        );
    } finally {
        await connection?.close();
    }
}

// Check if documents are purchased
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
        const publicationNumber = searchParams.get('publicationNumber');
        
        if (!publicationNumber) {
            return NextResponse.json(
                { error: "شماره انتشار مناقصه الزامی است" },
                { status: 400 }
            );
        }
        
        const sql = `
            SELECT pt.ID, pt.PAYMENT_DATE, pt.AMOUNT
            FROM PAYMENT_TRANSACTION pt
            JOIN PUBLISHED_PROCESSES pp ON pt.PUBLISHED_PROCESS_ID = pp.ID
            WHERE pp.PUBLICATION_NUMBER = :pubNum1
                AND pt.CONTRACTOR_ID = :contractorId1
                AND pt.PAYMENT_TYPE = 'DOCUMENT_PURCHASE'
                AND pt.STATUS = 'COMPLETED'
        `;
        
        const result = await query(sql, [
            publicationNumber,
            session.contractorId
        ]);
        
        return NextResponse.json({
            purchased: result && result.length > 0,
            payment: result && result.length > 0 ? result[0] : null
        });
        
    } catch (error) {
        console.error("Error checking purchase status:", error);
        
        return NextResponse.json(
            { error: "خطا در بررسی وضعیت خرید" },
            { status: 500 }
        );
    }
}
