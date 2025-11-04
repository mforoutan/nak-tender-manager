"use client";

import { useState } from "react";
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
    uploadedFiles?: { [key: string]: File | null };
    uploadProgress?: { [key: string]: number };
    uploadedFileIds?: { [key: string]: number };
    onFileChange?: (documentId: string, file: File | null) => void;
    onUploadFile?: (documentId: string) => void;
    onDeleteFile?: (documentId: string, fileId?: number) => void;
}

export function CompanyInfoForm({
    formData,
    onFormDataChange,
    isEditable = true,
    uploadedFiles = {},
    uploadProgress = {},
    uploadedFileIds = {},
    onFileChange,
    onUploadFile,
    onDeleteFile,
}: CompanyInfoFormProps) {
    const [openSections, setOpenSections] = useState<string[]>(["section-1"]);

    const handleAccordionChange = (value: string[]) => {
        setOpenSections(value);
    };

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
                    uploadedFiles={uploadedFiles}
                    uploadProgress={uploadProgress}
                    uploadedFileIds={uploadedFileIds}
                    onFileChange={onFileChange}
                    onUploadFile={onUploadFile}
                    onDeleteFile={onDeleteFile}
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
                />
            </Accordion>

            <div className="text-sm text-slate-500 mt-6">
                <p>برای تکمیل فرم، لطفاً تمامی بخش‌ها را باز کرده و اطلاعات خواسته شده را تکمیل نمایید.</p>
            </div>
        </div>
    );
}
