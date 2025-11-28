"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

interface ChangePasswordFormProps {
    changePasswordAction: (formData: FormData) => Promise<{ success: boolean; error?: string; message?: string }>;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <Button type="submit" disabled={pending} size="lg" className="min-w-[200px]">
            {pending ? "در حال تغییر..." : "تغییر رمز عبور"}
        </Button>
    );
}

export function ChangePasswordForm({ changePasswordAction }: ChangePasswordFormProps) {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{
        oldPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    const validatePasswords = () => {
        const newErrors: {
            oldPassword?: string;
            newPassword?: string;
            confirmPassword?: string;
        } = {};

        if (!oldPassword) {
            newErrors.oldPassword = "رمز عبور فعلی الزامی است";
        }

        if (!newPassword) {
            newErrors.newPassword = "رمز عبور جدید الزامی است";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "رمز عبور باید حداقل ۸ کاراکتر باشد";
        } else if (newPassword === oldPassword) {
            newErrors.newPassword = "رمز عبور جدید نباید با رمز فعلی یکسان باشد";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "تکرار رمز عبور الزامی است";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "رمز عبور و تکرار آن یکسان نیستند";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (formData: FormData) => {
        if (!validatePasswords()) {
            const firstError = errors.oldPassword || errors.newPassword || errors.confirmPassword;
            if (firstError) {
                toast.error(firstError);
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await changePasswordAction(formData);

            if (result.success) {
                toast.success(result.message || "رمز عبور با موفقیت تغییر یافت");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setErrors({});
            } else {
                toast.error(result.error || "خطا در تغییر رمز عبور");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("خطا در تغییر رمز عبور");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form action={handleSubmit}>
            <Card className="px-6 py-8 shadow-card-small">
                <CardContent className="p-0">
                    <FieldGroup className="gap-y-6">
                        <div className="grid gap-y-6 gap-x-8 md:grid-cols-2">
                            <Field className="gap-1 md:col-span-2">
                                <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="oldPassword">
                                    رمز عبور فعلی
                                    <span className="text-red-500 ml-1">*</span>
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="oldPassword"
                                        name="oldPassword"
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="رمز عبور فعلی خود را وارد کنید"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        aria-invalid={!!errors.oldPassword}
                                        className={errors.oldPassword ? "border-destructive" : ""}
                                        disabled={isSubmitting}
                                    />
                                    <InputGroupAddon align="inline-end" className="pl-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="focus:outline-none"
                                            disabled={isSubmitting}
                                        >
                                            {showOldPassword ? (
                                                <EyeIcon className="text-black size-5" />
                                            ) : (
                                                <EyeClosedIcon className="text-black size-5" />
                                            )}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors.oldPassword && (
                                    <FieldDescription className="text-destructive">
                                        {errors.oldPassword}
                                    </FieldDescription>
                                )}
                            </Field>

                            <Field className="gap-1">
                                <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="newPassword">
                                    رمز عبور جدید
                                    <span className="text-red-500 ml-1">*</span>
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="رمز عبور جدید"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        aria-invalid={!!errors.newPassword}
                                        className={errors.newPassword ? "border-destructive" : ""}
                                        disabled={isSubmitting}
                                    />
                                    <InputGroupAddon align="inline-end" className="pl-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="focus:outline-none"
                                            disabled={isSubmitting}
                                        >
                                            {showNewPassword ? (
                                                <EyeIcon className="text-black size-5" />
                                            ) : (
                                                <EyeClosedIcon className="text-black size-5" />
                                            )}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription className={errors.newPassword ? "text-destructive" : "text-[#A9A9A9]"}>
                                    {errors.newPassword || "رمز عبور باید حداقل ۸ کاراکتر باشد"}
                                </FieldDescription>
                            </Field>

                            <Field className="gap-1">
                                <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="confirmPassword">
                                    تکرار رمز عبور جدید
                                    <span className="text-red-500 ml-1">*</span>
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="تکرار رمز عبور جدید"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        aria-invalid={!!errors.confirmPassword}
                                        className={errors.confirmPassword ? "border-destructive" : ""}
                                        disabled={isSubmitting}
                                    />
                                    <InputGroupAddon align="inline-end" className="pl-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="focus:outline-none"
                                            disabled={isSubmitting}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeIcon className="text-black size-5" />
                                            ) : (
                                                <EyeClosedIcon className="text-black size-5" />
                                            )}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription className={errors.confirmPassword ? "text-destructive" : "text-[#A9A9A9]"}>
                                    {errors.confirmPassword || "رمز عبور جدید را دوباره وارد کنید"}
                                </FieldDescription>
                            </Field>
                        </div>
                    </FieldGroup>

                    <div className="flex justify-end mt-8">
                        <SubmitButton />
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
