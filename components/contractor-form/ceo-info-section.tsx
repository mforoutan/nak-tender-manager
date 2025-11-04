"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
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
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">اطلاعات مدیر عامل</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3">
                <FieldGroup className="gap-y-4">
                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="ceoFullName">نام و نام خانوادگی مدیر عامل</FieldLabel>
                            <Input
                                id="ceoFullName"
                                
                                value={formData.ceoFullName}
                                onChange={(e) => onFormDataChange("ceoFullName", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="ceoNationalId">کد ملی مدیر عامل</FieldLabel>
                            <Input
                                id="ceoNationalId"
                                
                                value={formData.ceoNationalId}
                                onChange={(e) => onFormDataChange("ceoNationalId", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="ceoMobile">شماره موبایل مدیر عامل</FieldLabel>
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
