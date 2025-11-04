"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone } from "lucide-react";
import { ContractorFormData } from "@/types";

interface ContactInfoSectionProps {
    formData: ContractorFormData;
    onFormDataChange: (field: keyof ContractorFormData, value: string) => void;
    isEditable?: boolean;
}

export function ContactInfoSection({
    formData,
    onFormDataChange,
    isEditable = true,
}: ContactInfoSectionProps) {
    return (
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
                <FieldGroup className="gap-y-4">
                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="phone">شماره تلفن ثابت</FieldLabel>
                            <Input
                                id="phone"
                                
                                value={formData.phone}
                                onChange={(e) => onFormDataChange("phone", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="mobile">شماره موبایل</FieldLabel>
                            <Input
                                id="mobile"
                                
                                value={formData.mobile}
                                onChange={(e) => onFormDataChange("mobile", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="fax">شماره فکس</FieldLabel>
                            <Input
                                id="fax"
                                
                                value={formData.fax}
                                onChange={(e) => onFormDataChange("fax", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="website">وب‌سایت</FieldLabel>
                            <Input
                                id="website"
                                
                                value={formData.website}
                                onChange={(e) => onFormDataChange("website", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="email">ایمیل</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                
                                value={formData.email}
                                onChange={(e) => onFormDataChange("email", e.target.value)}
                                disabled={!isEditable}
                            />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="province">
                                <span className="text-red-500 ml-1">*</span>
                                استان
                            </FieldLabel>
                            <Select
                                value={formData.province}
                                onValueChange={(value) => onFormDataChange("province", value)}
                                disabled={!isEditable}
                            >
                                <SelectTrigger id="province">
                                    <SelectValue  />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tehran">تهران</SelectItem>
                                    <SelectItem value="isfahan">اصفهان</SelectItem>
                                    <SelectItem value="shiraz">شیراز</SelectItem>
                                    {/* Add more provinces */}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <div className="grid gap-y-4 gap-x-8 md:grid-cols-2">
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="city">
                                <span className="text-red-500 ml-1">*</span>
                                شهر
                            </FieldLabel>
                            <Select
                                value={formData.city}
                                onValueChange={(value) => onFormDataChange("city", value)}
                                disabled={!isEditable}
                            >
                                <SelectTrigger id="city">
                                    <SelectValue  />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tehran">تهران</SelectItem>
                                    <SelectItem value="karaj">کرج</SelectItem>
                                    {/* Cities should be filtered based on selected province */}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground" htmlFor="postalCode">
                                <span className="text-red-500 ml-1">*</span>
                                کد پستی
                            </FieldLabel>
                            <Input
                                id="postalCode"
                                
                                value={formData.postalCode}
                                onChange={(e) => onFormDataChange("postalCode", e.target.value)}
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
