import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/lib/otp-store";

const MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, code } = body;

    if (!mobile || !code) {
      return NextResponse.json(
        { error: "شماره موبایل و کد تایید الزامی است" },
        { status: 400 }
      );
    }

    // Validate OTP code format (5 digits)
    if (!/^\d{5}$/.test(code)) {
      return NextResponse.json(
        { error: "کد تایید باید ۵ رقم باشد" },
        { status: 400 }
      );
    }

    const storedData = otpStore.get(mobile);

    if (!storedData) {
      return NextResponse.json(
        { error: "کد تایید یافت نشد. لطفاً دوباره درخواست دهید" },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(mobile);
      return NextResponse.json(
        { error: "کد تایید منقضی شده است. لطفاً دوباره درخواست دهید" },
        { status: 410 }
      );
    }

    // Check max attempts
    if (storedData.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(mobile);
      return NextResponse.json(
        { error: "تعداد تلاش‌های مجاز تمام شده است. لطفاً دوباره درخواست دهید" },
        { status: 429 }
      );
    }

    // Verify the code
    if (storedData.code !== code) {
      storedData.attempts += 1;
      otpStore.set(mobile, storedData);

      const remainingAttempts = MAX_ATTEMPTS - storedData.attempts;
      return NextResponse.json(
        {
          error: "کد تایید اشتباه است",
          remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Success - remove OTP from store
    otpStore.delete(mobile);

    return NextResponse.json(
      {
        success: true,
        message: "شماره موبایل با موفقیت تایید شد",
        verified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "خطا در تایید کد" },
      { status: 500 }
    );
  }
}
