"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { useState, useRef } from "react";
import { ContractorFormData } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    ContractorFormStep,
    MobileVerificationStep,
    FinalConfirmationStep,
} from "./register-step-cards";
import { CompanyInfoFormRef } from "@/components/contractor-form";

export function AuthRegisterForm() {
    const router = useRouter();
    const formRef = useRef<CompanyInfoFormRef>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [repPhoneInvalid, setRepPhoneInvalid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [invalidFields, setInvalidFields] = useState<Set<keyof ContractorFormData>>(new Set());

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
        ceoFirstName: "",
        ceoLastName: "",
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
        repFirstName: "",
        repLastName: "",
        repPhone: "",
        repEmail: "",
    });

    const handleFormDataChange = (field: keyof ContractorFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };




    const handleNextStep = async () => {
        // Step 0: Send OTP before moving to mobile verification step
        if (currentStep === 0) {
            // Validate all required fields before sending OTP
            const newInvalidFields = new Set<keyof ContractorFormData>();
            let firstErrorSection: 'main' | 'contact' | 'banking' | 'representative' | null = null;
            let firstErrorMessage = '';
            
            // Section 1: Main Info - companyName, nationalId
            if (!formData.companyName) {
                newInvalidFields.add('companyName');
                if (!firstErrorSection) {
                    firstErrorSection = 'main';
                    firstErrorMessage = "لطفا نام شرکت را وارد کنید";
                }
            }
            
            if (!formData.nationalId) {
                newInvalidFields.add('nationalId');
                if (!firstErrorSection) {
                    firstErrorSection = 'main';
                    firstErrorMessage = "لطفا شناسه ملی را وارد کنید";
                }
            }
            
            // Section 3: Contact Info - mobile, province, city, postalCode
            if (!formData.mobile) {
                newInvalidFields.add('mobile');
                if (!firstErrorSection) {
                    firstErrorSection = 'contact';
                    firstErrorMessage = "لطفا شماره موبایل را وارد کنید";
                }
            }
            
            if (!formData.province) {
                newInvalidFields.add('province');
                if (!firstErrorSection) {
                    firstErrorSection = 'contact';
                    firstErrorMessage = "لطفا استان را انتخاب کنید";
                }
            }
            
            if (!formData.city) {
                newInvalidFields.add('city');
                if (!firstErrorSection) {
                    firstErrorSection = 'contact';
                    firstErrorMessage = "لطفا شهر را انتخاب کنید";
                }
            }
            
            if (!formData.postalCode) {
                newInvalidFields.add('postalCode');
                if (!firstErrorSection) {
                    firstErrorSection = 'contact';
                    firstErrorMessage = "لطفا کد پستی را وارد کنید";
                }
            }
            
            // Section 4: Banking Info - shabaNumber
            if (!formData.shabaNumber) {
                newInvalidFields.add('shabaNumber');
                if (!firstErrorSection) {
                    firstErrorSection = 'banking';
                    firstErrorMessage = "لطفا شماره شبا را وارد کنید";
                }
            }
            
            // Section 5: Representative Info - repFirstName, repLastName, repPhone
            if (!formData.repFirstName) {
                newInvalidFields.add('repFirstName');
                if (!firstErrorSection) {
                    firstErrorSection = 'representative';
                    firstErrorMessage = "لطفا نام نماینده را وارد کنید";
                }
            }
            
            if (!formData.repLastName) {
                newInvalidFields.add('repLastName');
                if (!firstErrorSection) {
                    firstErrorSection = 'representative';
                    firstErrorMessage = "لطفا نام خانوادگی نماینده را وارد کنید";
                }
            }
            
            if (!formData.repPhone) {
                newInvalidFields.add('repPhone');
                if (!firstErrorSection) {
                    firstErrorSection = 'representative';
                    firstErrorMessage = "لطفا شماره همراه نماینده را وارد کنید";
                }
            }

            if (formData.repPhone && !/^09\d{9}$/.test(formData.repPhone)) {
                newInvalidFields.add('repPhone');
                if (!firstErrorSection) {
                    firstErrorSection = 'representative';
                    firstErrorMessage = "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد";
                }
            }

            // If there are any validation errors
            if (newInvalidFields.size > 0) {
                setInvalidFields(newInvalidFields);
                
                // Set repPhoneInvalid if repPhone is in invalid fields
                if (newInvalidFields.has('repPhone')) {
                    setRepPhoneInvalid(true);
                }
                
                // Open the first section with errors
                if (firstErrorSection === 'main') {
                    formRef.current?.openMainInfoSection();
                } else if (firstErrorSection === 'contact') {
                    formRef.current?.openContactSection();
                } else if (firstErrorSection === 'banking') {
                    formRef.current?.openBankingSection();
                } else if (firstErrorSection === 'representative') {
                    formRef.current?.openRepresentativeSection();
                }
                
                toast.error(firstErrorMessage);
                return;
            }

            setRepPhoneInvalid(false);
            setInvalidFields(new Set()); // Clear invalid fields if all validations pass

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

    const handleSubmit = async (password: string) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "خطا در ثبت نام");
                return;
            }

            toast.success("ثبت نام با موفقیت انجام شد");

            // Redirect to dashboard after successful signup
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (error) {
            toast.error("خطا در اتصال به سرور");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="text-center text-2xl font-bold">به سیستم ثبت نام ناک خوش آمدید</h1>
            <div dir="rtl" className="w-full flex flex-col items-center gap-y-10">
                <Stepper className="max-w-lg" steps={["اطلاعات شرکت", "تایید شماره موبایل", "انتخاب رمز ورود"]} currentStep={currentStep} />
                <Card className="w-full p-4.5 lg:p-12 shadow-auth-card border-none" dir="rtl">
                    {currentStep === 0 && (
                        <ContractorFormStep
                            formData={formData}
                            onFormDataChange={handleFormDataChange}
                            onNext={handleNextStep}
                            repPhoneInvalid={repPhoneInvalid}
                            invalidFields={invalidFields}
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
                            isSubmitting={isSubmitting}
                        />
                    )}
                </Card>
            </div>
        </>
    );
}
