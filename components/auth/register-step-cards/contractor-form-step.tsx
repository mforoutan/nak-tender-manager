import { CompanyInfoForm } from "@/components/contractor-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractorFormData } from "@/types";

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
}: ContractorFormStepProps) {
    return (
        <>
            <CardHeader className="text-right mb-8">
                <CardTitle>اطلاعات شرکت</CardTitle>
            </CardHeader>
            <CardContent>
                <CompanyInfoForm
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={true}
                    uploadedFiles={uploadedFiles}
                    uploadProgress={uploadProgress}
                    uploadedFileIds={uploadedFileIds}
                    onFileChange={onFileChange}
                    onUploadFile={onUploadFile}
                    onDeleteFile={onDeleteFile}
                />
            </CardContent>
            <CardFooter className="flex justify-end mt-6">
                    <Button onClick={onNext}>
                        مرحله بعد
                    </Button>
            </CardFooter>
        </>
    );
}
