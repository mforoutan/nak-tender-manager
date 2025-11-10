"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

interface FinalConfirmationStepProps {
    onSubmit: () => void;
    onPrevious: () => void;
}

export function FinalConfirmationStep({
    onSubmit,
    onPrevious,
}: FinalConfirmationStepProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    return (
        <>
            <CardHeader className="text-right mb-8">
                <CardTitle className="font-bold text-xl">تایید شماره موبایل</CardTitle>
            </CardHeader>
            <CardContent className="mb-12">
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
                                />
                                <InputGroupAddon align={`inline-end`} className="pl-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="text-black size-5" />
                                        ) : (
                                            <EyeClosedIcon className="text-black size-5" />
                                        )}
                                    </button>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription className="text-[#A9A9A9]">
                                رمز عبور انتخابی خود را وارد کنید
                            </FieldDescription>
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="confirmPassword">
                                تکرار رمز عبور
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder=""
                                />
                                <InputGroupAddon align={`inline-end`} className="pl-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeIcon className="text-black size-5" />
                                        ) : (
                                            <EyeClosedIcon className="text-black size-5" />
                                        )}
                                    </button>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription className="text-[#A9A9A9]">
                                رمز عبور انتخابی را دوباره وارد کنید
                            </FieldDescription>
                        </Field>
                    </div>
                </FieldGroup>
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={onPrevious}>
                    مرحله قبل
                </Button>
                <Button onClick={onSubmit}>
                    ثبت
                </Button>
            </CardFooter>
        </>
    );
}
