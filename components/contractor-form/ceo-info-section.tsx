"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CrownIcon } from "lucide-react";
import { ContractorFormData } from "@/types";

interface CeoInfoSectionProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    isEditable?: boolean;
}

export function CeoInfoSection({
    formData,
    onFormDataChange,
    isEditable = true,
}: CeoInfoSectionProps) {
    return (
        <AccordionItem value="section-2" className="border rounded-md bg-white p-4 mt-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#F6F6F6] rounded-full">
                        <CrownIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">اطلاعات مدیر عامل</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3">
                <FieldGroup className="gap-y-4">
                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="ceoFirstName">نام مدیر عامل</FieldLabel>
                            <Input
                                id="ceoFirstName"
                                value={formData.ceoFirstName}
                                onChange={(e) => onFormDataChange("ceoFirstName", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="ceoLastName">نام خانوادگی مدیر عامل</FieldLabel>
                            <Input
                                id="ceoLastName"
                                value={formData.ceoLastName}
                                onChange={(e) => onFormDataChange("ceoLastName", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="ceoNationalId">کد ملی مدیر عامل</FieldLabel>
                            <Input
                                id="ceoNationalId"
                                value={formData.ceoNationalId}
                                onChange={(e) => onFormDataChange("ceoNationalId", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="ceoMobile">شماره موبایل مدیر عامل</FieldLabel>
                            <Input
                                id="ceoMobile"
                                value={formData.ceoMobile}
                                onChange={(e) => onFormDataChange("ceoMobile", e.target.value)}
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
