"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersianDatePicker } from "@/components/ui/persian-date-picker";
import { Building } from "lucide-react";
import { ContractorFormData } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ContractorType {
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
}

interface ContractorCategory {
    id: number;
    code: string;
    name: string;
    description: string;
    parentId: number | null;
    isActive: boolean;
    displayOrder: number;
}

interface MainInfoSectionProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    isEditable?: boolean;
    invalidFields?: Set<keyof ContractorFormData>;
}

const requiredDocuments = [
    { id: "documents", name: "اسناد و مستندات" },
];

export function MainInfoSection({
    formData,
    onFormDataChange,
    isEditable = true,
    invalidFields = new Set(),
}: MainInfoSectionProps) {
    const [contractorTypes, setContractorTypes] = useState<ContractorType[]>([]);
    const [contractorCategories, setContractorCategories] = useState<ContractorCategory[]>([]);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Fetch contractor types on mount
    useEffect(() => {
        const fetchContractorTypes = async () => {
            setLoadingTypes(true);
            try {
                const response = await fetch("/api/contractor-types");
                const data = await response.json();

                if (response.ok) {
                    setContractorTypes(data);
                } else {
                    toast.error(data.error || "خطا در دریافت انواع شرکت");
                }
            } catch (error) {
                toast.error("خطا در اتصال به سرور");
            } finally {
                setLoadingTypes(false);
            }
        };

        fetchContractorTypes();
    }, []);

    // Fetch contractor categories (main categories only)
    useEffect(() => {
        const fetchContractorCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await fetch("/api/contractor-categories?parentId=null");
                const data = await response.json();

                if (response.ok) {
                    setContractorCategories(data);
                } else {
                    toast.error(data.error || "خطا در دریافت دسته‌بندی‌ها");
                }
            } catch (error) {
                toast.error("خطا در اتصال به سرور");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchContractorCategories();
    }, []);

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
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="companyName">
                                <span className="text-red-500">*</span>
                                نام شرکت
                            </FieldLabel>
                            <Input
                                id="companyName"
                                aria-invalid={invalidFields.has('companyName')}
                                value={formData.companyName}
                                onChange={(e) => onFormDataChange("companyName", e.target.value)}
                                disabled={!isEditable}
                                required
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="companyNameEN">
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
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="companyType">نوع شرکت</FieldLabel>
                            <Select
                                value={formData.companyType}
                                onValueChange={(value) => onFormDataChange("companyType", value)}
                                disabled={!isEditable || loadingTypes}
                            >
                                <SelectTrigger id="companyType">
                                    <SelectValue placeholder={loadingTypes ? "در حال بارگذاری..." : "انتخاب کنید"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {contractorTypes.map((type) => (
                                        <SelectItem key={type.id} value={String(type.id)}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="companyCategory">
                                نوع فعالیت
                            </FieldLabel>
                            <Select
                                value={formData.companyCategory}
                                onValueChange={(value) => onFormDataChange("companyCategory", value)}
                                disabled={!isEditable || loadingCategories}
                            >
                                <SelectTrigger id="companyCategory">
                                    <SelectValue placeholder={loadingCategories ? "در حال بارگذاری..." : "انتخاب کنید"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {contractorCategories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="nationalId">
                                <span className="text-red-500">*</span>
                                شناسه ملی شرکت
                            </FieldLabel>
                            <Input
                                id="nationalId"
                                aria-invalid={invalidFields.has('nationalId')}
                                value={formData.nationalId}
                                onChange={(e) => onFormDataChange("nationalId", e.target.value)}
                                disabled={!isEditable}
                                required
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="establishmentDate">تاریخ تأسیس</FieldLabel>
                            <PersianDatePicker
                                id="establishmentDate"
                                value={formData.establishmentDate}
                                onChange={(date) => onFormDataChange("establishmentDate", date)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="economicCode">کد اقتصادی</FieldLabel>
                            <Input
                                id="economicCode"
                                value={formData.economicCode}
                                onChange={(e) => onFormDataChange("economicCode", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="registrationNumber">شماره ثبت</FieldLabel>
                            <Input
                                id="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={(e) => onFormDataChange("registrationNumber", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="registrationPlace">محل ثبت</FieldLabel>
                            <Input
                                id="registrationPlace"

                                value={formData.registrationPlace}
                                onChange={(e) => onFormDataChange("registrationPlace", e.target.value)}
                                disabled={!isEditable}
                            />
                            <FieldDescription>در دست توسعه</FieldDescription>
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="insuranceBranch">شعبه بیمه</FieldLabel>
                            <Input
                                id="insuranceBranch"

                                value={formData.insuranceBranch}
                                onChange={(e) => onFormDataChange("insuranceBranch", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    );
}
