"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone } from "lucide-react";
import { ContractorFormData } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Province {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
}

interface City {
    id: number;
    code: string;
    name: string;
    provinceId: number;
    isActive: boolean;
}

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
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    // Fetch provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const response = await fetch("/api/locations/provinces");
                const data = await response.json();

                if (response.ok) {
                    setProvinces(data.data);
                } else {
                    toast.error(data.error || "خطا در دریافت لیست استان‌ها");
                }
            } catch (error) {
                toast.error("خطا در اتصال به سرور");
            } finally {
                setLoadingProvinces(false);
            }
        };

        fetchProvinces();
    }, []);

    // Fetch cities when province changes
    useEffect(() => {
        if (!formData.province) {
            setCities([]);
            return;
        }

        const fetchCities = async () => {
            setLoadingCities(true);
            try {
                const response = await fetch(`/api/locations/cities?provinceId=${formData.province}`);
                const data = await response.json();

                if (response.ok) {
                    setCities(data.data);
                } else {
                    toast.error(data.error || "خطا در دریافت لیست شهرها");
                }
            } catch (error) {
                toast.error("خطا در اتصال به سرور");
            } finally {
                setLoadingCities(false);
            }
        };

        fetchCities();
    }, [formData.province]);

    // Clear city when province changes
    const handleProvinceChange = (value: string) => {
        onFormDataChange("province", value);
        onFormDataChange("city", ""); // Reset city selection
    };

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
                                onValueChange={handleProvinceChange}
                                disabled={!isEditable || loadingProvinces}
                            >
                                <SelectTrigger id="province">
                                    <SelectValue placeholder={loadingProvinces ? "در حال بارگذاری..." : "انتخاب کنید"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map((province) => (
                                        <SelectItem key={province.id} value={String(province.id)}>
                                            {province.name}
                                        </SelectItem>
                                    ))}
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
                                disabled={!isEditable || !formData.province || loadingCities}
                            >
                                <SelectTrigger id="city">
                                    <SelectValue placeholder={
                                        loadingCities 
                                            ? "در حال بارگذاری..." 
                                            : !formData.province 
                                                ? "ابتدا استان را انتخاب کنید" 
                                                : "انتخاب کنید"
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city.id} value={String(city.id)}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
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
