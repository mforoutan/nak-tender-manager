"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { Accordion } from "@/components/ui/accordion";
import { ContractorFormData } from "@/types";
import { MainInfoSection } from "./main-info-section";
import { CeoInfoSection } from "./ceo-info-section";
import { ContactInfoSection } from "./contact-info-section";
import { BankingInfoSection } from "./banking-info-section";
import { RepresentativeInfoSection } from "./representative-info-section";

interface CompanyInfoFormProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    isEditable?: boolean;
    repPhoneInvalid?: boolean;
}

export interface CompanyInfoFormRef {
    openRepresentativeSection: () => void;
}

export const CompanyInfoForm = forwardRef<CompanyInfoFormRef, CompanyInfoFormProps>(({
    formData,
    onFormDataChange,
    isEditable = true,
    repPhoneInvalid = false,
}, ref) => {
    const [openSections, setOpenSections] = useState<string[]>(["section-1"]);

    const handleAccordionChange = (value: string[]) => {
        setOpenSections(value);
    };

    useImperativeHandle(ref, () => ({
        openRepresentativeSection: () => {
            setOpenSections(prev => {
                if (!prev.includes("section-5")) {
                    return [...prev, "section-5"];
                }
                return prev;
            });
        },
    }));

    return (
        <div className="gap-y-4">
            <Accordion
                type="multiple"
                value={openSections}
                onValueChange={handleAccordionChange}
                className="w-full"
            >
                <MainInfoSection
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={isEditable}
                />

                <CeoInfoSection
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={isEditable}
                />

                <ContactInfoSection
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={isEditable}
                />

                <BankingInfoSection
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={isEditable}
                />

                <RepresentativeInfoSection
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={isEditable}
                    repPhoneInvalid={repPhoneInvalid}
                />
            </Accordion>
        </div>
    );
});

CompanyInfoForm.displayName = "CompanyInfoForm";
