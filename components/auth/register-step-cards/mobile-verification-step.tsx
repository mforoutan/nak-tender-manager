"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {  cn, toPersianNumbers } from "@/lib/utils";
import { set } from "zod";

interface MobileVerificationStepProps {
    mobile: string;
    onNext: () => void;
    onPrevious: () => void;
}

export function MobileVerificationStep({
    mobile,
    onNext,
    onPrevious,
}: MobileVerificationStepProps) {
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [resendTimer, setResendTimer] = useState(120); // 2 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    // Format mobile number for display (mask middle digits)
    const formatMobile = (mobile: string) => {
        if (mobile.length === 11) {
            return `${mobile.slice(0, 4)}******${mobile.slice(-3)}`;
        }
        return mobile;
    };

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    // Format timer display
    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        if (otp.length !== 5) {
            toast.error("لطفا کد ۵ رقمی را کامل وارد کنید");
            return;
        }

        setIsVerifying(true);
        setIsError(false); // Reset error state
        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mobile, code: otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                setIsError(true); // Set error state for visual feedback

                if (response.status === 410) {
                    toast.error("کد تایید منقضی شده است. لطفا کد جدید درخواست کنید");
                } else if (response.status === 429) {
                    toast.error("تعداد تلاش‌های مجاز تمام شده است. لطفا کد جدید درخواست کنید");
                } else if (data.remainingAttempts !== undefined) {
                    toast.error(`${data.error} - تلاش‌های باقیمانده: ${toPersianNumbers(data.remainingAttempts.toString())}`);
                } else {
                    toast.error(data.error || "کد تایید نادرست است");
                }

                return;
            }

            setIsError(false);
            setIsSuccess(true);
            toast.success("شماره موبایل با موفقیت تایید شد");
            onNext();
        } catch (error) {
            setIsError(true);
            toast.error("خطا در اتصال به سرور");
            setTimeout(() => {
                setOtp("");
                setIsError(false);
            }, 1000);
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (!canResend) return;

        try {
            const response = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mobile }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "خطا در ارسال مجدد کد");
                return;
            }

            toast.success("کد تایید مجدد ارسال شد");

            // Show dev OTP in development mode
            if (data.dev_otp) {
                toast.info(`کد تایید (توسعه): ${data.dev_otp}`, { duration: 10000 });
            }

            // Reset timer and OTP
            setResendTimer(120);
            setCanResend(false);
            setOtp("");
        } catch (error) {
            toast.error("خطا در اتصال به سرور");
        }
    };

    return (
        <>
            <CardHeader className="p-0 text-center lg:text-right">
                <CardTitle className="font-bold text-xl">تایید شماره موبایل</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col lg:w-xl lg:self-center items-center justify-center p-0">
                <FieldGroup>
                    <Field>
                        <FieldDescription className="flex flex-col lg:flex-row gap-2 items-center justify-center">
                            <span>
                                کد پیامک شده به شماره
                                <span dir="ltr">
                                    &nbsp;{toPersianNumbers(formatMobile(mobile))}&nbsp;
                                </span>
                                را وارد کنید.
                            </span>
                            <Button className="text-primary bg-[#FFEFE9] hover:bg-[#FFEFE9]/90" onClick={onPrevious}>ویرایش شماره همراه</Button>
                        </FieldDescription>
                        <InputOTP
                            maxLength={5}
                            pattern={REGEXP_ONLY_DIGITS}
                            id="otp"
                            required
                            containerClassName="justify-center text-center"
                            value={otp}
                            onChange={setOtp}
                            onComplete={handleVerifyOtp}
                        >
                            <InputOTPGroup dir="ltr" className={cn("gap-2 *:data-[slot=input-otp-slot]:box-content *:data-[slot=input-otp-slot]:rounded-2xl *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:w-4.5 *:data-[slot=input-otp-slot]:px-4.5 *:data-[slot=input-otp-slot]:py-5 *:data-[slot=input-otp-slot]:font-medium *:data-[slot=input-otp-slot]:text-2.5xl *:data-[slot=input-otp-slot]:leading-5",
                                "*:data-[success=true]:border-success *:data-[success=true]:shadow-[0px 4.4px 29.81px 0px rgba(52, 199, 89, 1)]"
                            )}>
                                <InputOTPSlot data-success={isSuccess} aria-invalid={isError} index={0} />
                                <InputOTPSlot data-success={isSuccess} aria-invalid={isError} index={1} />
                                <InputOTPSlot data-success={isSuccess} aria-invalid={isError} index={2} />
                                <InputOTPSlot data-success={isSuccess} aria-invalid={isError} index={3} />
                                <InputOTPSlot data-success={isSuccess} aria-invalid={isError} index={4} />
                            </InputOTPGroup>
                        </InputOTP>
                    </Field>
                    <FieldGroup>
                        <FieldDescription className="text-center">

                            {canResend ? (
                                <Button
                                    variant="link"
                                    className="bg-black text-white font-semibold no-underline"
                                    onClick={handleResendOtp}
                                >
                                    ارسال دوباره کد
                                </Button>
                            ) : isError ? (
                                <div className="flex flex-col gap-12 items-center">
                                    <span className="font-bold text-base text-destructive">کد وارد شده اشتباه است!</span>
                                    <Button
                                        variant="link"
                                        className="bg-black text-white font-semibold no-underline"
                                        onClick={handleResendOtp}
                                    >
                                        ارسال دوباره کد
                                    </Button>
                                </div>
                            ) : (
                                <span>ارسال دوباره کد {toPersianNumbers(formatTimer(resendTimer))}</span>
                            )}
                        </FieldDescription>
                    </FieldGroup>
                </FieldGroup>
            </CardContent>
            <CardFooter className="p-0 flex justify-between mt-6">
                <Button variant="outline" onClick={onPrevious}>
                    مرحله قبل
                </Button>
            </CardFooter>
        </>
    );
}
