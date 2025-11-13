"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { ContractorFormData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ConfirmationStepProps {
    formData: ContractorFormData;
    uploadedFiles: { [key: string]: File | null };
    onPrevious: () => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

export function ConfirmationStep({
    formData,
    uploadedFiles,
    onPrevious,
    onSubmit,
    isSubmitting = false,
}: ConfirmationStepProps) {
    const requiredDocuments = [
        { id: "registration", name: "اساسنامه شرکت" },
        { id: "newspaper", name: "روزنامه رسمی" },
        { id: "tax", name: "گواهی مالیاتی" },
        { id: "certificate", name: "گواهینامه صلاحیت" },
    ];

    return (
        <>
            <CardContent className="p-0">
                <div className="space-y-6">
                    {/* Company Information */}
                    <div className="bg-white rounded-lg border p-6">
                        <h3 className="text-lg font-semibold mb-4">اطلاعات شرکت</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="نام شرکت" value={formData.companyName} />
                            <InfoItem label="شناسه ملی" value={formData.nationalId} />
                            <InfoItem label="کد اقتصادی" value={formData.economicCode} />
                            <InfoItem label="شماره ثبت" value={formData.registrationNumber} />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-lg border p-6">
                        <h3 className="text-lg font-semibold mb-4">اطلاعات تماس</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="تلفن" value={formData.phone} />
                            <InfoItem label="موبایل" value={formData.mobile} />
                            <InfoItem label="ایمیل" value={formData.email} />
                            <InfoItem label="کد پستی" value={formData.postalCode} />
                        </div>
                    </div>

                    {/* Banking Information */}
                    <div className="bg-white rounded-lg border p-6">
                        <h3 className="text-lg font-semibold mb-4">اطلاعات بانکی</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="شماره شبا" value={formData.shabaNumber} />
                            <InfoItem label="شماره حساب" value={formData.accountNumber} />
                        </div>
                    </div>

                    {/* Representative Information */}
                    <div className="bg-white rounded-lg border p-6">
                        <h3 className="text-lg font-semibold mb-4">اطلاعات نماینده</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="نام" value={formData.repFirstName} />
                            <InfoItem label="نام خانوادگی" value={formData.repLastName} />
                            <InfoItem label="شماره تماس" value={formData.repPhone} />
                            <InfoItem label="ایمیل" value={formData.repEmail} />
                        </div>
                    </div>

                    {/* Uploaded Documents */}
                    <div className="bg-white rounded-lg border p-6">
                        <h3 className="text-lg font-semibold mb-4">مدارک بارگذاری شده</h3>
                        <div className="space-y-2">
                            {requiredDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                                >
                                    <span className="text-sm">{doc.name}</span>
                                    {uploadedFiles[doc.id] ? (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            بارگذاری شده
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                            بارگذاری نشده
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            لطفاً اطلاعات وارد شده را بررسی کنید. پس از تأیید، اطلاعات شما برای بررسی به کارشناسان ارسال خواهد شد.
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-6 p-0">
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={isSubmitting}
                    className="bg-transparent font-semibold"
                >
                    مرحله قبل
                </Button>
                <Button onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "در حال ارسال..." : "تأیید و ارسال"}
                </Button>
            </CardFooter>
        </>
    );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-medium">{value || "-"}</p>
        </div>
    );
}
