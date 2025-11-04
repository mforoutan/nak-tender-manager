"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building, CreditCard, FileText, Phone, User, UserCog } from "lucide-react";
import { PersianDatePicker } from "./ui/persian-date-picker";
import { FileUpload } from "./ui/file-upload";
import { ContractorFormData } from "@/types";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";

const requiredDocuments = [
    { id: "registration", name: "اساسنامه شرکت", description: "آخرین نسخه اساسنامه شرکت" },
    { id: "newspaper", name: "روزنامه رسمی", description: "آخرین آگهی تغییرات در روزنامه رسمی" },
    { id: "tax", name: "گواهی مالیاتی", description: "آخرین گواهی مالیات بر ارزش افزوده" },
    { id: "certificate", name: "گواهینامه صلاحیت", description: "گواهینامه تأیید صلاحیت از مراجع ذیصلاح" },
];

interface CompanyInfoAccordionFormProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    isEditable?: boolean;
    uploadedFiles?: { [key: string]: File | null };
    uploadProgress?: { [key: string]: number };
    uploadedFileIds?: { [key: string]: number };
    onFileChange?: (documentId: string, file: File | null) => void;
    onUploadFile?: (documentId: string) => void;
    onDeleteFile?: (documentId: string, fileId?: number) => void;
}

export function CompanyInfoAccordionForm({
    formData,
    onFormDataChange,
    isEditable = true,
    uploadedFiles = {},
    uploadProgress = {},
    uploadedFileIds = {},
    onFileChange,
    onUploadFile,
    onDeleteFile,
}: CompanyInfoAccordionFormProps) {
    const [openSections, setOpenSections] = useState<string[]>(["section-1"]);

    const handleAccordionChange = (value: string[]) => {
        setOpenSections(value);
    };

    const updateFormData = (field: keyof ContractorFormData, value: string) => {
        onFormDataChange(field, value);
    };

    const handleFileChange = (documentId: string, file: File | null) => {
        if (onFileChange) {
            onFileChange(documentId, file);
        }
    };

    const uploadFile = (documentId: string) => {
        if (onUploadFile) {
            onUploadFile(documentId);
        }
    };

    const handleDeleteFile = (documentId: string, fileId?: number) => {
        if (onDeleteFile) {
            onDeleteFile(documentId, fileId);
        }
    };

    return (
        <div className="space-y-4">
            <Accordion
                type="multiple"
                value={openSections}
                onValueChange={handleAccordionChange}
                className="w-full"
            >
                {/* اطلاعات اصلی (Main Information) */}
                <AccordionItem value="section-1" className="border rounded-md bg-white p-4">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#F6F6F6] rounded-full">
                                <Building className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">اطلاعات اصلی</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                        <FieldGroup className="">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="companyName">
                                        نام شرکت
                                        <span className="text-red-500 mr-1">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="companyName"
                                        placeholder="نام شرکت خود را وارد کنید"
                                        value={formData.companyName}
                                        onChange={(e) => updateFormData("companyName", e.target.value)}
                                        disabled={!isEditable}
                                        required
                                        className={!formData.companyName && formData.companyName !== '' ? 'border-red-300' : ''}
                                    />
                                    {!formData.companyName && (
                                        <FieldDescription className="text-xs text-red-500">این فیلد الزامی است</FieldDescription>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="companyNameEN">
                                        نام شرکت به انگلیسی
                                        <span className="text-red-500 mr-1">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="companyNameEN"
                                        placeholder="نام شرکت خود را وارد کنید"
                                        value={formData.companyNameEN}
                                        onChange={(e) => updateFormData("companyNameEN", e.target.value)}
                                        disabled={!isEditable}
                                        required
                                        className={!formData.companyName && formData.companyName !== '' ? 'border-red-300' : ''}
                                    />
                                    {!formData.companyName && (
                                        <FieldDescription className="text-xs text-red-500">این فیلد الزامی است</FieldDescription>
                                    )}
                                </Field>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="companyType">نوع شرکت</FieldLabel>
                                    <Select
                                        value={formData.companyType}
                                        onValueChange={(value) => updateFormData("companyType", value)}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger id="companyType" className="w-full">
                                            <SelectValue placeholder="نوع شرکت را انتخاب کنید" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="private">خصوصی</SelectItem>
                                            <SelectItem value="public">دولتی</SelectItem>
                                            <SelectItem value="semi-public">نیمه دولتی</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="establishmentDate">تاریخ تأسیس</FieldLabel>
                                    <PersianDatePicker
                                        id="establishmentDate"
                                        value={formData.establishmentDate}
                                        onChange={(date) => updateFormData("establishmentDate", date)}
                                        placeholder="تاریخ تأسیس را انتخاب کنید"
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="registrationNumber">شماره ثبت</FieldLabel>
                                    <Input
                                        id="registrationNumber"
                                        placeholder="شماره ثبت شرکت"
                                        value={formData.registrationNumber}
                                        onChange={(e) => updateFormData("registrationNumber", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="economicCode">کد اقتصادی</FieldLabel>
                                    <Input
                                        id="economicCode"
                                        placeholder="کد اقتصادی شرکت"
                                        value={formData.economicCode}
                                        onChange={(e) => updateFormData("economicCode", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="nationalId">شناسه ملی شرکت</FieldLabel>
                                <Input
                                    id="nationalId"
                                    placeholder="شناسه ملی شرکت را وارد کنید"
                                    value={formData.nationalId}
                                    onChange={(e) => updateFormData("nationalId", e.target.value)}
                                    disabled={!isEditable}
                                />
                            </Field>
                        </FieldGroup>
                    </AccordionContent>
                </AccordionItem>

                {/* اطلاعات مدیر عامل (CEO Information) */}
                <AccordionItem value="section-2" className="border rounded-md bg-white p-4 mt-3">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#F6F6F6] rounded-full">
                                <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">اطلاعات مدیر عامل</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                        <FieldGroup className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="ceoFirstName">نام</FieldLabel>
                                    <Input
                                        id="ceoFirstName"
                                        placeholder="نام مدیر عامل"
                                        value={formData.ceoFirstName}
                                        onChange={(e) => updateFormData("ceoFirstName", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="ceoLastName">نام خانوادگی</FieldLabel>
                                    <Input
                                        id="ceoLastName"
                                        placeholder="نام خانوادگی مدیر عامل"
                                        value={formData.ceoLastName}
                                        onChange={(e) => updateFormData("ceoLastName", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="ceoNationalId">کد ملی</FieldLabel>
                                    <Input
                                        id="ceoNationalId"
                                        placeholder="کد ملی مدیر عامل"
                                        value={formData.ceoNationalId}
                                        onChange={(e) => updateFormData("ceoNationalId", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="ceoBirthDate">تاریخ تولد</FieldLabel>
                                    <PersianDatePicker
                                        id="ceoBirthDate"
                                        value={formData.ceoBirthDate}
                                        onChange={(date) => updateFormData("ceoBirthDate", date)}
                                        placeholder="تاریخ تولد را انتخاب کنید"
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="ceoMobile">شماره موبایل</FieldLabel>
                                    <Input
                                        id="ceoMobile"
                                        placeholder="شماره موبایل مدیر عامل"
                                        value={formData.ceoMobile}
                                        onChange={(e) => updateFormData("ceoMobile", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="ceoPosition">سمت</FieldLabel>
                                    <Input
                                        id="ceoPosition"
                                        placeholder="سمت مدیر عامل"
                                        value={formData.ceoPosition}
                                        onChange={(e) => updateFormData("ceoPosition", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                        </FieldGroup>
                    </AccordionContent>
                </AccordionItem>

                {/* اطلاعات تماس (Contact Information) */}
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
                        <FieldGroup className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <Field>
                                    <FieldLabel htmlFor="phone">شماره تلفن</FieldLabel>
                                    <Input
                                        id="phone"
                                        placeholder="شماره تلفن ثابت"
                                        value={formData.phone}
                                        onChange={(e) => updateFormData("phone", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="fax">شماره فکس</FieldLabel>
                                    <Input
                                        id="fax"
                                        placeholder="شماره فکس"
                                        value={formData.fax}
                                        onChange={(e) => updateFormData("fax", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email">ایمیل</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="آدرس ایمیل"
                                        value={formData.email}
                                        onChange={(e) => updateFormData("email", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="website">وب‌سایت</FieldLabel>
                                    <Input
                                        id="website"
                                        placeholder="آدرس وب‌سایت"
                                        value={formData.website}
                                        onChange={(e) => updateFormData("website", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="postalCode">کد پستی</FieldLabel>
                                    <Input
                                        id="postalCode"
                                        placeholder="کد پستی ۱۰ رقمی"
                                        value={formData.postalCode}
                                        onChange={(e) => updateFormData("postalCode", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="address">آدرس</FieldLabel>
                                <Textarea
                                    id="address"
                                    placeholder="آدرس کامل را وارد کنید"
                                    value={formData.address}
                                    onChange={(e) => updateFormData("address", e.target.value)}
                                    rows={3}
                                    disabled={!isEditable}
                                />
                            </Field>
                        </FieldGroup>
                    </AccordionContent>
                </AccordionItem>

                {/* اطلاعات بانکی (Banking Information) */}
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
                        <FieldGroup className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="bankName">نام بانک</FieldLabel>
                                    <Input
                                        id="bankName"
                                        placeholder="نام بانک"
                                        value={formData.bankName}
                                        onChange={(e) => updateFormData("bankName", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="branchName">نام شعبه</FieldLabel>
                                    <Input
                                        id="branchName"
                                        placeholder="نام شعبه"
                                        value={formData.branchName}
                                        onChange={(e) => updateFormData("branchName", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="branchCode">کد شعبه</FieldLabel>
                                    <Input
                                        id="branchCode"
                                        placeholder="کد شعبه"
                                        value={formData.branchCode}
                                        onChange={(e) => updateFormData("branchCode", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="accountNumber">شماره حساب</FieldLabel>
                                    <Input
                                        id="accountNumber"
                                        placeholder="شماره حساب بانکی"
                                        value={formData.accountNumber}
                                        onChange={(e) => updateFormData("accountNumber", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="ibanNumber">شماره شبا</FieldLabel>
                                <Input
                                    id="ibanNumber"
                                    placeholder="IR شماره شبا با فرمت"
                                    value={formData.ibanNumber}
                                    onChange={(e) => updateFormData("ibanNumber", e.target.value)}
                                    disabled={!isEditable}
                                />
                            </Field>
                        </FieldGroup>
                    </AccordionContent>
                </AccordionItem>

                {/* اطلاعات نماینده (Representative Information) */}
                <AccordionItem value="section-5" className="border rounded-md bg-white p-4 mt-3">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#F6F6F6] rounded-full">
                                <UserCog className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">اطلاعات نماینده</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                        <FieldGroup className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="repFirstName">نام</FieldLabel>
                                    <Input
                                        id="repFirstName"
                                        placeholder="نام نماینده"
                                        value={formData.repFirstName}
                                        onChange={(e) => updateFormData("repFirstName", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="repLastName">نام خانوادگی</FieldLabel>
                                    <Input
                                        id="repLastName"
                                        placeholder="نام خانوادگی نماینده"
                                        value={formData.repLastName}
                                        onChange={(e) => updateFormData("repLastName", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <Field>
                                    <FieldLabel htmlFor="repNationalId">کد ملی</FieldLabel>
                                    <Input
                                        id="repNationalId"
                                        placeholder="کد ملی نماینده"
                                        value={formData.repNationalId}
                                        onChange={(e) => updateFormData("repNationalId", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="repPhone">شماره تماس</FieldLabel>
                                    <Input
                                        id="repPhone"
                                        placeholder="شماره تماس نماینده"
                                        value={formData.repPhone}
                                        onChange={(e) => updateFormData("repPhone", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="repPosition">سمت</FieldLabel>
                                    <Input
                                        id="repPosition"
                                        placeholder="سمت نماینده"
                                        value={formData.repPosition}
                                        onChange={(e) => updateFormData("repPosition", e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="repEmail">ایمیل</FieldLabel>
                                <Input
                                    id="repEmail"
                                    type="email"
                                    placeholder="آدرس ایمیل نماینده"
                                    value={formData.repEmail}
                                    onChange={(e) => updateFormData("repEmail", e.target.value)}
                                    disabled={!isEditable}
                                />
                            </Field>
                        </FieldGroup>
                    </AccordionContent>
                </AccordionItem>

                {/* Document Upload Section */}
                <AccordionItem value="section-6" className="border rounded-md bg-white p-4 mt-3">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#F6F6F6] rounded-full">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">مدارک مورد نیاز</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                        <FieldGroup className="space-y-6">
                            <p className="text-sm text-muted-foreground">
                                لطفاً تمامی مدارک خواسته شده را با فرمت PDF یا JPG بارگذاری نمایید. حداکثر سایز هر فایل 5 مگابایت می‌باشد.
                            </p>

                            <div className="grid gap-6 md:grid-cols-2">
                                {requiredDocuments.map((doc) => (
                                    <Field key={doc.id}>
                                        <FieldLabel className="font-medium text-base">
                                            {doc.name}
                                        </FieldLabel>
                                        <FieldDescription className="mt-1">{doc.description}</FieldDescription>
                                        <FileUpload
                                            id={`file-${doc.id}`}
                                            onFileChange={(file) => handleFileChange(doc.id, file)}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            disabled={!isEditable}
                                            maxSize={5}
                                            file={uploadedFiles[doc.id]}
                                            uploadProgress={uploadProgress[doc.id]}
                                            onUpload={() => uploadFile(doc.id)}
                                            onDelete={() => handleDeleteFile(doc.id, uploadedFileIds[doc.id])}
                                            fileId={uploadedFileIds[doc.id]}
                                        />
                                    </Field>
                                ))}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="mr-3">
                                        <h3 className="text-sm font-medium text-blue-800">توجه</h3>
                                        <div className="mt-1 text-sm text-blue-700">
                                            <p>تمامی مدارک باید خوانا و واضح باشند. در صورت نیاز به ارائه مدارک تکمیلی، پس از بررسی اولیه به شما اطلاع داده خواهد شد.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FieldGroup>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="text-sm text-slate-500 mt-6">
                <p>برای تکمیل فرم، لطفاً تمامی بخش‌ها را باز کرده و اطلاعات خواسته شده را تکمیل نمایید.</p>
            </div>
        </div>
    );
}