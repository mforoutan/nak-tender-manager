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
    invalidFields?: Set<keyof ContractorFormData>;
}

export interface CompanyInfoFormRef {
    openRepresentativeSection: () => void;
    openMainInfoSection: () => void;
    openContactSection: () => void;
    openBankingSection: () => void;
}

export const CompanyInfoForm = forwardRef<CompanyInfoFormRef, CompanyInfoFormProps>(({
    formData,
    onFormDataChange,
    isEditable = true,
    repPhoneInvalid = false,
    invalidFields = new Set(),
}, ref) => {
    const [openSections, setOpenSections] = useState<string[]>(["section-1"]);

    const handleAccordionChange = (value: string[]) => {
        setOpenSections(value);
    };

    useImperativeHandle(ref, () => ({
        openRepresentativeSection: () => {
            setOpenSections(prev => 
                prev.includes("section-5") ? prev : [...prev, "section-5"]
            );
        },
        openMainInfoSection: () => {
            setOpenSections(prev => 
                prev.includes("section-1") ? prev : [...prev, "section-1"]
            );
        },
        openContactSection: () => {
            setOpenSections(prev => 
                prev.includes("section-3") ? prev : [...prev, "section-3"]
            );
        },
        openBankingSection: () => {
            setOpenSections(prev => 
                prev.includes("section-4") ? prev : [...prev, "section-4"]
            );
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
                    invalidFields={invalidFields}
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
                    invalidFields={invalidFields}
                />

                <BankingInfoSection
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={isEditable}
                    invalidFields={invalidFields}
                />

                <RepresentativeInfoSection
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={isEditable}
                    repPhoneInvalid={repPhoneInvalid}
                    invalidFields={invalidFields}
                />
            </Accordion>
        </div>
    );
});

CompanyInfoForm.displayName = "CompanyInfoForm";
