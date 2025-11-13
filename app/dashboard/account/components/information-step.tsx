"use client";

import { CompanyInfoForm, CompanyInfoFormRef } from "@/components/contractor-form";
import { DocumentsSection } from "@/components/contractor-form/documents-section";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { ContractorFormData } from "@/types";
import { useRef, useState } from "react";

interface InformationStepProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    uploadedFiles: { [key: string]: File | null };
    uploadProgress: { [key: string]: number };
    onFileChange: (documentId: string, file: File | null) => void;
    onFileDelete: (documentId: string) => void;
    onNext: () => void;
    onSaveDraft: () => void;
    isEditable?: boolean;
    isSaving?: boolean;
}

export function InformationStep({
    formData,
    onFormDataChange,
    uploadedFiles,
    uploadProgress,
    onFileChange,
    onFileDelete,
    onNext,
    onSaveDraft,
    isEditable = true,
    isSaving = false,
}: InformationStepProps) {
    const formRef = useRef<CompanyInfoFormRef>(null);
    const [openSections, setOpenSections] = useState<string[]>(["section-1"]);

    const handleAccordionChange = (value: string[]) => {
        setOpenSections(value);
    };

    return (
        <>
            <CardContent className="p-0">
                <Accordion
                    type="multiple"
                    value={openSections}
                    onValueChange={handleAccordionChange}
                    className="w-full"
                >
                    <CompanyInfoForm
                        ref={formRef}
                        formData={formData}
                        onFormDataChange={onFormDataChange}
                        isEditable={isEditable}
                    />
                    
                    <DocumentsSection
                        uploadedFiles={uploadedFiles}
                        uploadProgress={uploadProgress}
                        onFileChange={onFileChange}
                        onFileDelete={onFileDelete}
                        isEditable={isEditable}
                    />
                </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between mt-6 p-0">
                <Button
                    variant="outline"
                    onClick={onSaveDraft}
                    disabled={!isEditable || isSaving}
                    className="bg-transparent font-semibold"
                >
                    {isSaving ? "در حال ذخیره..." : "ذخیره پیش‌نویس"}
                </Button>
                <Button onClick={onNext} disabled={!isEditable}>
                    مرحله بعد
                </Button>
            </CardFooter>
        </>
    );
}
