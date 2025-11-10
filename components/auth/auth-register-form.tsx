"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { useState } from "react";
import { ContractorFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    ContractorFormStep,
    MobileVerificationStep,
    FinalConfirmationStep,
} from "./register-step-cards";

export function AuthRegisterForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({});
    const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
    const [uploadedFileIds, setUploadedFileIds] = useState<{[key: string]: number}>({});
    const [repPhoneInvalid, setRepPhoneInvalid] = useState(false);
    
    const [formData, setFormData] = useState<ContractorFormData>({
        // اطلاعات اصلی (Main Information)
        companyName: "",
        companyNameEN: "",
        companyType: "",
        companyCategory: "",
        nationalId: "",
        establishmentDate: "",
        economicCode: "",
        registrationNumber: "",
        registrationPlace: "",
        insuranceBranch: "",

        // اطلاعات مدیر عامل (CEO Information)
        ceoFullName: "",
        ceoNationalId: "",
        ceoMobile: "",

        // اطلاعات تماس (Contact Information)
        phone: "",
        mobile: "",
        fax: "",
        website: "",
        email: "",
        province: "",
        city: "",
        postalCode: "",

        // اطلاعات بانکی (Banking Information)
        bankName: "",
        bankBranch: "",
        accountNumber: "",
        shabaNumber: "",

        // اطلاعات نماینده (Representative Information)
        repFullName: "",
        repPhone: "",
        repEmail: "",
    });

    const handleFormDataChange = (field: keyof ContractorFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (documentId: string, file: File | null) => {
        setUploadedFiles(prev => ({ ...prev, [documentId]: file }));
    };

    const handleUploadFile = async (documentId: string) => {
        const file = uploadedFiles[documentId];
        if (!file) {
            toast.error("لطفا ابتدا فایل را انتخاب کنید");
            return;
        }

        // Simulated upload - replace with actual API call
        setUploadProgress(prev => ({ ...prev, [documentId]: 0 }));
        
        // Simulate progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                const current = prev[documentId] || 0;
                if (current >= 100) {
                    clearInterval(interval);
                    return prev;
                }
                return { ...prev, [documentId]: current + 10 };
            });
        }, 200);

        // Simulated API call
        setTimeout(() => {
            clearInterval(interval);
            setUploadProgress(prev => ({ ...prev, [documentId]: 100 }));
            setUploadedFileIds(prev => ({ ...prev, [documentId]: Math.floor(Math.random() * 1000) }));
            toast.success("فایل با موفقیت آپلود شد");
        }, 2000);
    };

    const handleDeleteFile = (documentId: string, fileId?: number) => {
        // Implement delete logic here
        setUploadedFiles(prev => ({ ...prev, [documentId]: null }));
        setUploadProgress(prev => ({ ...prev, [documentId]: 0 }));
        setUploadedFileIds(prev => {
            const newIds = { ...prev };
            delete newIds[documentId];
            return newIds;
        });
        toast.success("فایل حذف شد");
    };

    const handleNextStep = async () => {
        // Step 0: Send OTP before moving to mobile verification step
        if (currentStep === 0) {
            // Validate repPhone before sending OTP
            if (!formData.repPhone) {
                setRepPhoneInvalid(true);
                toast.error("لطفا شماره همراه نماینده را وارد کنید");
                return;
            }
            
            if (!/^09\d{9}$/.test(formData.repPhone)) {
                setRepPhoneInvalid(true);
                toast.error("شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد");
                return;
            }

            setRepPhoneInvalid(false);

            try {
                const response = await fetch("/api/auth/send-otp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ mobile: formData.repPhone }),
                });

                const data = await response.json();

                if (!response.ok) {
                    toast.error(data.message || "خطا در ارسال کد تایید");
                    return;
                }

                toast.success("کد تایید با موفقیت ارسال شد");
                
                // Show dev OTP in development mode
                if (data.dev_otp) {
                    toast.info(`کد تایید (توسعه): ${data.dev_otp}`, { duration: 10000 });
                }
                
                setCurrentStep(prev => prev + 1);
            } catch (error) {
                toast.error("خطا در اتصال به سرور");
            }
        } else if (currentStep < 2) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        // Implement registration submission logic
        toast.success("ثبت نام با موفقیت انجام شد");
    };
    
    return (
        <>
            <h1 className="text-center text-2xl font-bold">به سیستم ثبت نام ناک خوش آمدید</h1>
            <div dir="rtl" className="w-full flex flex-col items-center gap-y-10">
                <Stepper className="max-w-lg" steps={["اطلاعات شرکت", "تایید شماره موبایل", "انتخاب رمز ورود"]} currentStep={currentStep} />
                <Card className="w-full p-12 shadow-auth-card" dir="rtl">
                    <CardContent className="p-0">
                        {currentStep === 0 && (
                            <ContractorFormStep
                                formData={formData}
                                onFormDataChange={handleFormDataChange}
                                uploadedFiles={uploadedFiles}
                                uploadProgress={uploadProgress}
                                uploadedFileIds={uploadedFileIds}
                                onFileChange={handleFileChange}
                                onUploadFile={handleUploadFile}
                                onDeleteFile={handleDeleteFile}
                                onNext={handleNextStep}
                                repPhoneInvalid={repPhoneInvalid}
                            />
                        )}
                        {currentStep === 1 && (
                            <MobileVerificationStep
                                mobile={formData.repPhone}
                                onNext={handleNextStep}
                                onPrevious={handlePreviousStep}
                            />
                        )}
                        {currentStep === 2 && (
                            <FinalConfirmationStep
                                onSubmit={handleSubmit}
                                onPrevious={handlePreviousStep}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
