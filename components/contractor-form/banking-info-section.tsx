"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { ContractorFormData } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Bank {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
}

interface BankingInfoSectionProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    isEditable?: boolean;
    invalidFields?: Set<keyof ContractorFormData>;
}

export function BankingInfoSection({
    formData,
    onFormDataChange,
    isEditable = true,
    invalidFields = new Set(),
}: BankingInfoSectionProps) {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loadingBanks, setLoadingBanks] = useState(false);

    // Fetch banks on mount
    useEffect(() => {
        const fetchBanks = async () => {
            setLoadingBanks(true);
            try {
                const response = await fetch("/api/banks");
                const data = await response.json();

                if (response.ok) {
                    setBanks(data);
                } else {
                    toast.error(data.error || "خطا در دریافت لیست بانک‌ها");
                }
            } catch (error) {
                toast.error("خطا در اتصال به سرور");
            } finally {
                setLoadingBanks(false);
            }
        };

        fetchBanks();
    }, []);

    return (
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
                <FieldGroup className="gap-y-4">
                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="bankName">نام بانک</FieldLabel>
                            <Select
                                value={formData.bankName}
                                onValueChange={(value) => onFormDataChange("bankName", value)}
                                disabled={!isEditable || loadingBanks}
                            >
                                <SelectTrigger id="bankName">
                                    <SelectValue placeholder={loadingBanks ? "در حال بارگذاری..." : "انتخاب کنید"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {banks.map((bank) => (
                                        <SelectItem key={bank.id} value={String(bank.id)}>
                                            {bank.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="bankBranch">نام شعبه</FieldLabel>
                            <Input
                                id="bankBranch"
                                value={formData.bankBranch}
                                onChange={(e) => onFormDataChange("bankBranch", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="accountNumber">شماره حساب</FieldLabel>
                            <Input
                                id="accountNumber"
                                value={formData.accountNumber}
                                onChange={(e) => onFormDataChange("accountNumber", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor="shabaNumber">
                                <span className="text-red-500">*</span>
                                شماره شبا
                            </FieldLabel>
                            <Input
                                id="shabaNumber"
                                aria-invalid={invalidFields.has('shabaNumber')}
                                value={formData.shabaNumber}
                                onChange={(e) => onFormDataChange("shabaNumber", e.target.value)}
                                disabled={!isEditable}
                                required
                            />
                        </Field>
                    </div>
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    );
}
