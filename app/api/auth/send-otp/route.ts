import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { otpStore } from "@/lib/otp-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile } = body;

    if (!mobile) {
      return NextResponse.json(
        { error: "شماره موبایل الزامی است" },
        { status: 400 }
      );
    }

    // Validate mobile number format (Iranian format: 09xxxxxxxxx)
    const mobileRegex = /^09\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json(
        { error: "فرمت شماره موبایل صحیح نیست" },
        { status: 400 }
      );
    }

    // Check if mobile exists in database
    let connection;
    try {
      connection = await getConnection();
      
      const result = await connection.execute(
        `SELECT COUNT(*) as count FROM CONTRACTORS WHERE MOBILE = :mobile`,
        { mobile }
      );

      const count = (result.rows?.[0] as any)?.COUNT || 0;
      
      if (count > 0) {
        return NextResponse.json(
          { error: "این شماره موبایل قبلاً ثبت شده است" },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "خطا در بررسی شماره موبایل" },
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

    // Generate 5-digit OTP code
    const otpCode = Math.floor(10000 + Math.random() * 90000).toString();
    
    // Set expiration time (5 minutes)
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Store OTP with attempts counter
    otpStore.set(mobile, { code: otpCode, expiresAt, attempts: 0 });

    // TODO: Integrate with SMS API (Kavenegar, Ghasedak, etc.)
    // Example for Kavenegar:
    // const smsResponse = await fetch('https://api.kavenegar.com/v1/{API-KEY}/verify/lookup.json', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({
    //     receptor: mobile,
    //     token: otpCode,
    //     template: 'verify'
    //   })
    // });

    // For development/testing - log the OTP code
    console.log(`OTP for ${mobile}: ${otpCode}`);

    return NextResponse.json(
      {
        success: true,
        message: "کد تایید ارسال شد",
        // In production, remove this line
        dev_otp: process.env.NODE_ENV === "development" ? otpCode : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "خطا در ارسال کد تایید" },
      { status: 500 }
    );
  }
}
