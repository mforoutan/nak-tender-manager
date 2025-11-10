"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UserCog } from "lucide-react";
import { ContractorFormData } from "@/types";

interface RepresentativeInfoSectionProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    isEditable?: boolean;
    repPhoneInvalid?: boolean;
}

export function RepresentativeInfoSection({
    formData,
    onFormDataChange,
    isEditable = true,
    repPhoneInvalid = false,
}: RepresentativeInfoSectionProps) {
    return (
        <AccordionItem value="section-5" className="border rounded-md bg-white p-4 mt-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#F6F6F6] rounded-full">
                        <UserCog className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">اطلاعات نماینده</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3">
                <FieldGroup className="gap-y-4">
                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="repFullName">نام و نام خانوادگی نماینده</FieldLabel>
                            <Input
                                id="repFullName"
                                
                                value={formData.repFullName}
                                onChange={(e) => onFormDataChange("repFullName", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="repPhone">
                                شماره تماس نماینده
                                <span className="text-red-500 ml-1">*</span>
                            </FieldLabel>
                            <Input
                                id="repPhone"
                                value={formData.repPhone}
                                onChange={(e) => onFormDataChange("repPhone", e.target.value)}
                                disabled={!isEditable}
                                aria-invalid={repPhoneInvalid}
                                className={repPhoneInvalid ? "border-destructive" : ""}
                            />
                            {repPhoneInvalid && (
                                <FieldDescription className="text-right text-sm text-destructive mt-1">
                                    لطفا شماره همراه نماینده را وارد کنید
                                </FieldDescription>
                            )}
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="repEmail">ایمیل نماینده</FieldLabel>
                            <Input
                                id="repEmail"
                                type="email"
                                
                                value={formData.repEmail}
                                onChange={(e) => onFormDataChange("repEmail", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <div></div>
                    </div>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    );
}
