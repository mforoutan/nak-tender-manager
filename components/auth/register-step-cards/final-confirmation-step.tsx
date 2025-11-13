"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";

interface FinalConfirmationStepProps {
    onSubmit: (password: string) => void;
    onPrevious: () => void;
    isSubmitting?: boolean;
}

export function FinalConfirmationStep({
    onSubmit,
    onPrevious,
    isSubmitting = false,
}: FinalConfirmationStepProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

    const validatePassword = () => {
        const newErrors: { password?: string; confirmPassword?: string } = {};

        if (!password) {
            newErrors.password = "رمز عبور الزامی است";
        } else if (password.length < 8) {
            newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "تکرار رمز عبور الزامی است";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "رمز عبور و تکرار آن یکسان نیستند";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validatePassword()) {
            onSubmit(password);
        } else {
            if (errors.password) {
                toast.error(errors.password);
            } else if (errors.confirmPassword) {
                toast.error(errors.confirmPassword);
            }
        }
    };

    return (
        <>
            <CardHeader className="p-0 text-center lg:text-right mb-8">
                <CardTitle className="font-bold text-xl">انتخاب رمز ورود</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mb-12">
                <FieldGroup className="gap-y-4">
                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="password">
                                رمز عبور
                                <span className="text-red-500 ml-1">*</span>
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    aria-invalid={!!errors.password}
                                    className={errors.password ? "border-destructive" : ""}
                                    disabled={isSubmitting}
                                />
                                <InputGroupAddon align={`inline-end`} className="pl-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none"
                                        disabled={isSubmitting}
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="text-black size-5" />
                                        ) : (
                                            <EyeClosedIcon className="text-black size-5" />
                                        )}
                                    </button>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription className={errors.password ? "text-destructive" : "text-[#A9A9A9]"}>
                                {errors.password || "رمز عبور باید حداقل ۸ کاراکتر باشد"}
                            </FieldDescription>
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="confirmPassword">
                                تکرار رمز عبور
                                <span className="text-red-500 ml-1">*</span>
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder=""
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    aria-invalid={!!errors.confirmPassword}
                                    className={errors.confirmPassword ? "border-destructive" : ""}
                                    disabled={isSubmitting}
                                />
                                <InputGroupAddon align={`inline-end`} className="pl-3">
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
                                {errors.confirmPassword || "رمز عبور انتخابی را دوباره وارد کنید"}
                            </FieldDescription>
                        </Field>
                    </div>
                </FieldGroup>
            </CardContent>
            <CardFooter className="p-0 justify-between">
                <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
                    مرحله قبل
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "در حال ثبت..." : "ثبت"}
                </Button>
            </CardFooter>
        </>
    );
}
