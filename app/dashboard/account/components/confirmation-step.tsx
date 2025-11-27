"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { ContractorFormData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Building2, User, Phone, CreditCard, FileText, UserCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    const [openSections, setOpenSections] = useState<string[]>(["section-1"]);

    const requiredDocuments = [
        { id: "registration", name: "اساسنامه شرکت" },
        { id: "newspaper", name: "روزنامه رسمی" },
        { id: "tax", name: "گواهی مالیاتی" },
        { id: "certificate", name: "گواهینامه صلاحیت" },
    ];

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
                    {/* Section 1: Main Information */}
                    <AccordionItem value="section-1" className="border rounded-md bg-white p-4 mt-3">
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <Building2 className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات اصلی شرکت</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3">
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
                        </AccordionContent>
                    </AccordionItem>

                    {/* Section 2: CEO Information */}
                    <AccordionItem value="section-2" className="border rounded-md bg-white p-4 mt-3">
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات مدیرعامل</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3">
                            <div className="space-y-2">
                                <InfoItem label="نام" value={formData.ceoFirstName} />
                                <InfoItem label="نام خانوادگی" value={formData.ceoLastName} />
                                <InfoItem label="کد ملی" value={formData.ceoNationalId} />
                                <InfoItem label="شماره موبایل" value={formData.ceoMobile} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Section 3: Contact Information */}
                    <AccordionItem value="section-3" className="border rounded-md bg-white p-4 mt-3">
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات تماس</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3">
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
                        </AccordionContent>
                    </AccordionItem>

                    {/* Section 4: Banking Information */}
                    <AccordionItem value="section-4" className="border rounded-md bg-white p-4 mt-3">
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات بانکی</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3">
                            <div className="space-y-2">
                                <InfoItem label="نام بانک" value={formData.bankName} />
                                <InfoItem label="شعبه" value={formData.bankBranch} />
                                <InfoItem label="شماره حساب" value={formData.accountNumber} />
                                <InfoItem label="شماره شبا" value={formData.shabaNumber} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Section 5: Representative Information */}
                    <AccordionItem value="section-5" className="border rounded-md bg-white p-4 mt-3">
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">اطلاعات نماینده</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3">
                            <div className="space-y-2">
                                <InfoItem label="نام" value={formData.repFirstName} />
                                <InfoItem label="نام خانوادگی" value={formData.repLastName} />
                                <InfoItem label="شماره تماس" value={formData.repPhone} />
                                <InfoItem label="ایمیل" value={formData.repEmail} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Section 6: Documents */}
                    <AccordionItem value="section-6" className="border rounded-md bg-white p-4 mt-3">
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F6F6F6] rounded-full">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">مدارک بارگذاری شده</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3">
                            <div className="space-y-3">
                                {requiredDocuments.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                                    >
                                        <span className="text-sm font-medium">{doc.name}</span>
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
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-800">
                        لطفاً اطلاعات وارد شده را بررسی کنید. پس از تأیید، اطلاعات شما برای بررسی به کارشناسان ارسال خواهد شد.
                    </p>
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
        <div className="flex gap-x-2">
            <p className="text-sm text-[#4B5563]">{label}:</p>
            <p className="text-base font-bold text-black">{value || "-"}</p>
        </div>
    );
}
