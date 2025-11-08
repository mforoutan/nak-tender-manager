"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersianDatePicker } from "@/components/ui/persian-date-picker";
import { FileUpload } from "@/components/ui/file-upload";
import { Building } from "lucide-react";
import { ContractorFormData } from "@/types";

interface MainInfoSectionProps {
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

const requiredDocuments = [
    { id: "documents", name: "اسناد و مستندات" },
];

export function MainInfoSection({
    formData,
    onFormDataChange,
    isEditable = true,
    uploadedFiles = {},
    uploadProgress = {},
    uploadedFileIds = {},
    onFileChange,
    onUploadFile,
    onDeleteFile,
}: MainInfoSectionProps) {
    return (
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
                <FieldGroup className="gap-y-4">
                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="companyName">
                                نام شرکت
                                <span className="text-red-500 ml-1">*</span>
                            </FieldLabel>
                            <Input
                                id="companyName"

                                value={formData.companyName}
                                onChange={(e) => onFormDataChange("companyName", e.target.value)}
                                disabled={!isEditable}
                                required
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="companyNameEN">
                                نام شرکت (انگلیسی)
                            </FieldLabel>
                            <Input
                                id="companyNameEN"

                                value={formData.companyNameEN}
                                onChange={(e) => onFormDataChange("companyNameEN", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="companyType">نوع شرکت</FieldLabel>
                            <Select
                                value={formData.companyType}
                                onValueChange={(value) => onFormDataChange("companyType", value)}
                                disabled={!isEditable}
                            >
                                <SelectTrigger id="companyType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="private">خصوصی</SelectItem>
                                    <SelectItem value="public">سهامی عام</SelectItem>
                                    <SelectItem value="limited">با مسئولیت محدود</SelectItem>
                                    <SelectItem value="cooperative">تعاونی</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="companyCategory">
                                <span className="text-red-500 ml-1">*</span>
                                نوع فعالیت
                            </FieldLabel>
                            <Select
                                value={formData.companyCategory}
                                onValueChange={(value) => onFormDataChange("companyCategory", value)}
                                disabled={!isEditable}
                            >
                                <SelectTrigger id="companyCategory">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">طبقه ۱</SelectItem>
                                    <SelectItem value="2">طبقه ۲</SelectItem>
                                    <SelectItem value="3">طبقه ۳</SelectItem>
                                    <SelectItem value="4">طبقه ۴</SelectItem>
                                    <SelectItem value="5">طبقه ۵</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="nationalId">شناسه ملی شرکت</FieldLabel>
                            <Input
                                id="nationalId"

                                value={formData.nationalId}
                                onChange={(e) => onFormDataChange("nationalId", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="establishmentDate">تاریخ تأسیس</FieldLabel>
                            <PersianDatePicker
                                id="establishmentDate"
                                value={formData.establishmentDate}
                                onChange={(date) => onFormDataChange("establishmentDate", date)}
                                className="h-full"
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="economicCode">کد اقتصادی</FieldLabel>
                            <Input
                                id="economicCode"

                                value={formData.economicCode}
                                onChange={(e) => onFormDataChange("economicCode", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="registrationNumber">
                                <span className="text-red-500 ml-1">*</span>
                                شماره ثبت
                            </FieldLabel>
                            <Input
                                id="registrationNumber"

                                value={formData.registrationNumber}
                                onChange={(e) => onFormDataChange("registrationNumber", e.target.value)}
                                disabled={!isEditable}
                                required
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="registrationPlace">محل ثبت</FieldLabel>
                            <Input
                                id="registrationPlace"

                                value={formData.registrationPlace}
                                onChange={(e) => onFormDataChange("registrationPlace", e.target.value)}
                                disabled={!isEditable}
                            />
                            <FieldDescription>در دست توسعه</FieldDescription>
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="insuranceBranch">شعبه بیمه</FieldLabel>
                            <Input
                                id="insuranceBranch"

                                value={formData.insuranceBranch}
                                onChange={(e) => onFormDataChange("insuranceBranch", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {requiredDocuments.map((doc) => (
                                <Field className="gap-1 col-span-2" key={doc.id}>
                                    <FileUpload
                                        id={`file-${doc.id}`}
                                        onFileChange={(file) => onFileChange?.(doc.id, file)}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        disabled={!isEditable}
                                        maxSize={500}
                                        file={uploadedFiles[doc.id]}
                                        uploadProgress={uploadProgress[doc.id]}
                                        onUpload={() => onUploadFile?.(doc.id)}
                                        onDelete={() => onDeleteFile?.(doc.id, uploadedFileIds[doc.id])}
                                        fileId={uploadedFileIds[doc.id]}
                                    />
                                </Field>
                            ))}
                        </div>
                    </div>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    );
}
