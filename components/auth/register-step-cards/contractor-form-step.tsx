import { CompanyInfoForm, CompanyInfoFormRef } from "@/components/contractor-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractorFormData } from "@/types";
import Link from "next/link";
import { useRef } from "react";

interface ContractorFormStepProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    onNext: () => void;
    repPhoneInvalid?: boolean;
    invalidFields?: Set<keyof ContractorFormData>;
}

export function ContractorFormStep({
    formData,
    onFormDataChange,
    onNext,
    repPhoneInvalid = false,
    invalidFields = new Set(),
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
            <CardHeader className="p-0 text-right mb-8 hidden lg:flex">
                <CardTitle>اطلاعات شرکت</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <CompanyInfoForm
                    ref={formRef}
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    isEditable={true}
                    repPhoneInvalid={repPhoneInvalid}
                    invalidFields={invalidFields}
                />
            </CardContent>
            <CardFooter className="flex justify-between mt-6 p-0">
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
