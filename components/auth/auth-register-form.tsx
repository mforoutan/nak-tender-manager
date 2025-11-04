"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { useState } from "react";
import { CompanyInfoForm } from "@/components/contractor-form";
import { ContractorFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AuthRegisterForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({});
    const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
    const [uploadedFileIds, setUploadedFileIds] = useState<{[key: string]: number}>({});
    
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

    const handleNextStep = () => {
        // Add validation here before moving to next step
        if (currentStep < 2) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };
    
    return (
        <>
            <h1 className="text-center text-2xl font-bold">به سیستم ثبت نام ناک خوش آمدید</h1>
            <div dir="rtl" className="w-full flex flex-col items-center gap-y-10">
                <Stepper steps={["اطلاعات شرکت", "تایید شماره موبایل", "تایید نهایی"]} currentStep={currentStep} />
                <Card className="w-full p-12" dir="rtl">
                    <CardContent className="p-0">
                        {currentStep === 0 && (
                            <>
                                <CardHeader className="text-right">
                                    <CardTitle>اطلاعات شرکت</CardTitle>
                                </CardHeader>
                                <CompanyInfoForm
                                    formData={formData}
                                    onFormDataChange={handleFormDataChange}
                                    isEditable={true}
                                    uploadedFiles={uploadedFiles}
                                    uploadProgress={uploadProgress}
                                    uploadedFileIds={uploadedFileIds}
                                    onFileChange={handleFileChange}
                                    onUploadFile={handleUploadFile}
                                    onDeleteFile={handleDeleteFile}
                                />
                                <div className="flex justify-between mt-6">
                                    <Button variant="outline" disabled>
                                        مرحله قبل
                                    </Button>
                                    <Button onClick={handleNextStep}>
                                        مرحله بعد
                                    </Button>
                                </div>
                            </>
                        )}
                        {currentStep === 1 && (
                            <>
                                <CardHeader className="text-right">
                                    <CardTitle>تایید شماره موبایل</CardTitle>
                                </CardHeader>
                                <div className="flex items-center justify-center py-12">
                                    <p className="text-muted-foreground">مرحله تایید شماره موبایل</p>
                                </div>
                                <div className="flex justify-between mt-6">
                                    <Button variant="outline" onClick={handlePreviousStep}>
                                        مرحله قبل
                                    </Button>
                                    <Button onClick={handleNextStep}>
                                        مرحله بعد
                                    </Button>
                                </div>
                            </>
                        )}
                        {currentStep === 2 && (
                            <>
                                <CardHeader className="text-right">
                                    <CardTitle>تایید نهایی</CardTitle>
                                </CardHeader>
                                <div className="flex items-center justify-center py-12">
                                    <p className="text-muted-foreground">مرحله تایید نهایی</p>
                                </div>
                                <div className="flex justify-between mt-6">
                                    <Button variant="outline" onClick={handlePreviousStep}>
                                        مرحله قبل
                                    </Button>
                                    <Button>
                                        ثبت نام
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
