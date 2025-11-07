import { OTPForm } from "@/components/otp-form";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface MobileVerificationStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

export function MobileVerificationStep({
    onNext,
    onPrevious,
}: MobileVerificationStepProps) {
    return (
        <>
            <CardHeader className="text-right">
                <CardTitle className="font-bold text-xl">تایید شماره موبایل</CardTitle>
            </CardHeader>
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">مرحله تایید شماره موبایل</p>
                <form>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                            <InputOTP maxLength={6} id="otp" required>
                                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <FieldDescription>
                                Enter the 6-digit code sent to your email.
                            </FieldDescription>
                        </Field>
                        <FieldGroup>
                            <Button type="submit">Verify</Button>
                            <FieldDescription className="text-center">
                                Didn&apos;t receive the code? <a href="#">Resend</a>
                            </FieldDescription>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </div>
            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onPrevious}>
                    مرحله قبل
                </Button>
                {/* <Button onClick={onNext}>
                    مرحله بعد
                </Button> */}
            </div>
        </>
    );
}
