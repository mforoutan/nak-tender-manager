import { CompanyInfoForm, CompanyInfoFormRef } from "@/components/contractor-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractorFormData } from "@/types";
import Link from "next/link";
import { useRef } from "react";

interface ContractorFormStepProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    uploadedFiles: { [key: string]: File | null };
    uploadProgress: { [key: string]: number };
    uploadedFileIds: { [key: string]: number };
    onFileChange: (documentId: string, file: File | null) => void;
    onUploadFile: (documentId: string) => void;
    onDeleteFile: (documentId: string, fileId?: number) => void;
    onNext: () => void;
    repPhoneInvalid?: boolean;
}

export function ContractorFormStep({
    formData,
    onFormDataChange,
    uploadedFiles,
    uploadProgress,
    uploadedFileIds,
    onFileChange,
    onUploadFile,
    onDeleteFile,
    onNext,
    repPhoneInvalid = false,
}: ContractorFormStepProps) {
    const formRef = useRef<CompanyInfoFormRef>(null);

    const handleNext = () => {
        if (repPhoneInvalid && formRef.current) {
            formRef.current.openRepresentativeSection();
        }
        onNext();
    };

    return (
        <>
            <CardHeader className="text-right mb-8">
                <CardTitle>اطلاعات شرکت</CardTitle>
            </CardHeader>
            <CardContent>
                <CompanyInfoForm
                    ref={formRef}
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={true}
                    uploadedFiles={uploadedFiles}
                    uploadProgress={uploadProgress}
                    uploadedFileIds={uploadedFileIds}
                    onFileChange={onFileChange}
                    onUploadFile={onUploadFile}
                    onDeleteFile={onDeleteFile}
                    repPhoneInvalid={repPhoneInvalid}
                />
            </CardContent>
            <CardFooter className="flex justify-between mt-6">
                <Link href={`/`}>
                    <Button variant={`outline`} className="bg-transparent font-semibold">بازگشت به صفحه اصلی</Button>
                </Link>
                <Button onClick={handleNext}>
                    مرحله بعد
                </Button>
            </CardFooter>
        </>
    );
}
