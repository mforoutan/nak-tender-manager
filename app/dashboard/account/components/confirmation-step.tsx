"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ContractorFormData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Building2, User, Phone, CreditCard, FileText, UserCircle, X } from "lucide-react";

interface ConfirmationStepProps {
    formData: ContractorFormData;
    uploadedFiles: { [key: string]: File | null };
    uploadedFileIds?: { [key: string]: number };
    onPrevious: () => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

export function ConfirmationStep({
    formData,
    uploadedFiles,
    uploadedFileIds = {},
    onPrevious,
    onSubmit,
    isSubmitting = false,
}: ConfirmationStepProps) {
    const [openSections, setOpenSections] = useState<string[]>(["section-1"]);

    const requiredDocuments = [
{ id: "registration", name: "اساسنامه شرکت", },
    { id: "newspaper", name: "روزنامه رسمی", },
    { id: "changes", name: "آگهی تغییرات", },
    ];

    const handleDownload = (documentId: string) => {
        const file = uploadedFiles[documentId];
        const fileId = uploadedFileIds[documentId];

        if (file) {
            const blob = new Blob([file], { type: file.type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (fileId) {
            window.open(`/api/files/download/${fileId}`, '_blank');
        }
    };

    const handleAccordionChange = (value: string[]) => {
        setOpenSections(value);
    };

    return (
        <>
            <CardContent className="p-0">
                <section
                    className="w-full"
                >
                    {/* Section 1: Main Information */}
                    <div className="border rounded-md bg-white p-4 mt-3 shadow-card-small">
                        <div className="px-4 pt-3 pb-8 border-b border-border-default">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <Building2 className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات اصلی شرکت</h3>
                            </div>
                        </div>
                        <div className="px-4 py-8">
                            <div className="space-y-2">
                                <InfoItem label="نام شرکت (فارسی)" value={formData.companyName} />
                                <InfoItem label="نام شرکت (انگلیسی)" value={formData.companyNameEN} />
                                <InfoItem label="نوع شرکت" value={formData.companyType} />
                                <InfoItem label="رده شرکت" value={formData.companyCategory} />
                                <InfoItem label="شماره ثبت" value={formData.registrationNumber} />
                                <InfoItem label="کد اقتصادی" value={formData.economicCode} />
                                <InfoItem label="شناسه ملی" value={formData.nationalId} />
                                <InfoItem label="تاریخ تأسیس" value={formData.establishmentDate} />
                                <InfoItem label="محل ثبت" value={formData.registrationPlace} />
                                <InfoItem label="شعبه بیمه" value={formData.insuranceBranch} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: CEO Information */}
                    <div className="border rounded-md bg-white p-4 mt-3 shadow-card-small">
                        <div className="px-4 pt-3 pb-8 border-b border-border-default hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات مدیرعامل</h3>
                            </div>
                        </div>
                        <div className="px-4 py-8">
                            <div className="space-y-2">
                                <InfoItem label="نام" value={formData.ceoFirstName} />
                                <InfoItem label="نام خانوادگی" value={formData.ceoLastName} />
                                <InfoItem label="کد ملی" value={formData.ceoNationalId} />
                                <InfoItem label="شماره موبایل" value={formData.ceoMobile} />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Contact Information */}
                    <div className="border rounded-md bg-white p-4 mt-3 shadow-card-small">
                        <div className="px-4 pt-3 pb-8 border-b border-border-default hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات تماس</h3>
                            </div>
                        </div>
                        <div className="px-4 py-8">
                            <div className="space-y-2">
                                <InfoItem label="تلفن" value={formData.phone} />
                                <InfoItem label="موبایل" value={formData.mobile} />
                                <InfoItem label="فکس" value={formData.fax} />
                                <InfoItem label="ایمیل" value={formData.email} />
                                <InfoItem label="وب‌سایت" value={formData.website} />
                                <InfoItem label="استان" value={formData.province} />
                                <InfoItem label="شهر" value={formData.city} />
                                <InfoItem label="کد پستی" value={formData.postalCode} />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Banking Information */}
                    <div className="border rounded-md bg-white p-4 mt-3 shadow-card-small">
                        <div className="px-4 pt-3 pb-8 border-b border-border-default hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات بانکی</h3>
                            </div>
                        </div>
                        <div className="px-4 py-8">
                            <div className="space-y-2">
                                <InfoItem label="نام بانک" value={formData.bankName} />
                                <InfoItem label="شعبه" value={formData.bankBranch} />
                                <InfoItem label="شماره حساب" value={formData.accountNumber} />
                                <InfoItem label="شماره شبا" value={formData.shabaNumber} />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Representative Information */}
                    <div className="border rounded-md bg-white p-4 mt-3 shadow-card-small">
                        <div className="px-4 pt-3 pb-8 border-b border-border-default hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات نماینده</h3>
                            </div>
                        </div>
                        <div className="px-4 py-8">
                            <div className="space-y-2">
                                <InfoItem label="نام" value={formData.repFirstName} />
                                <InfoItem label="نام خانوادگی" value={formData.repLastName} />
                                <InfoItem label="شماره تماس" value={formData.repPhone} />
                                <InfoItem label="ایمیل" value={formData.repEmail} />
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Documents */}
                    <div className="mt-12 mb-8">
                        <h2 className="text-xl font-bold">مرحله دوم: آپلود اسناد و مدارک</h2>
                    </div>

                    <div className="py-8">
                        <div className="space-y-4">
                            {requiredDocuments.map((doc) => {
                                const file = uploadedFiles[doc.id];
                                const fileName = file?.name || 'فایل بارگذاری شده';

                                return (
                                    <Card key={doc.id} className="shadow-card-small py-8 px-6">
                                        <CardContent className="p-0 space-y-8">
                                                <p className="font-bold">{doc.name}:</p>
                                                {file ? (
                                                    <div className="py-1 px-2 flex items-center gap-x-2 border rounded-md bg-transparent text-green-500 w-fit">
                                                        <span
                                                            onClick={() => handleDownload(doc.id)}
                                                            className="cursor-pointer text-sm font-medium"
                                                        >
                                                            {fileName}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-medium text-foreground">-</p>
                                                )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </CardContent>
        </>
    );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex gap-x-2">
            <p className="text-sm text-[#4B5563]">{label}:</p>
            <p className="text-base font-bold text-black">{value || "-"}</p>
        </div>
    );
}
