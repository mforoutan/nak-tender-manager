"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersianDatePicker } from "@/components/ui/persian-date-picker";
import type { FormFieldConfig } from "@/types/form-fields";
import type { ContractorFormData } from "@/types";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";

interface FormFieldRendererProps {
    field: FormFieldConfig;
    value: string;
    onChange: (name: string, value: string) => void;
    formData?: ContractorFormData;
    disabled?: boolean;
    invalidFields?: Set<string>;
}

export function FormFieldRenderer({
    field,
    value,
    onChange,
    formData,
    disabled = false,
    invalidFields = new Set(),
}: FormFieldRendererProps) {
    const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    // Load dynamic options for select fields
    useEffect(() => {
        if (field.type === 'select' && field.apiEndpoint) {
            // Skip loading if field depends on another field that's not selected
            if (field.dependsOn && formData) {
                const dependentValue = formData[field.dependsOn as keyof ContractorFormData];
                if (!dependentValue) {
                    setOptions([]);
                    return;
                }
            }

            const loadOptions = async () => {
                setIsLoadingOptions(true);
                try {
                    let url = field.apiEndpoint!;

                    // Add query parameter for dependent fields
                    if (field.dependsOn && formData) {
                        const dependentValue = formData[field.dependsOn as keyof ContractorFormData];
                        if (field.name === 'city' && field.dependsOn === 'province') {
                            url += `?provinceId=${dependentValue}`;
                        }
                    }

                    console.log(`Loading options for ${field.name} from ${url}`);
                    const response = await fetch(url);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`Response for ${field.name}:`, data);

                        // Map response to options format
                        let mappedOptions: Array<{ value: string; label: string }> = [];

                        // Generic mapping - try to find the array in the response
                        let dataArray: any[] = [];
                        
                        // First check if response has a 'data' property (common API pattern)
                        if (data.data && Array.isArray(data.data)) {
                            dataArray = data.data;
                        } else if (field.name === 'province' && data.provinces) {
                            dataArray = data.provinces;
                        } else if (field.name === 'city' && data.cities) {
                            dataArray = data.cities;
                        } else if (field.name === 'bankName' && data.banks) {
                            dataArray = data.banks;
                        } else if (field.name === 'companyType' && data.contractorTypes) {
                            dataArray = data.contractorTypes;
                        } else if (field.name === 'companyCategory' && data.contractorCategories) {
                            dataArray = data.contractorCategories;
                        } else if (Array.isArray(data)) {
                            // If the response itself is an array
                            dataArray = data;
                        } else {
                            // Try to find any array in the response
                            const firstKey = Object.keys(data)[0];
                            if (firstKey && Array.isArray(data[firstKey])) {
                                dataArray = data[firstKey];
                            }
                        }

                        // Map the array to options
                        if (dataArray.length > 0) {
                            mappedOptions = dataArray.map((item: any) => ({
                                value: item.id?.toString() || item.ID?.toString() || item.value?.toString() || '',
                                label: item.name || item.NAME || item.label || item.title || '',
                            }));
                        }

                        console.log(`Mapped ${mappedOptions.length} options for ${field.name}`, mappedOptions.slice(0, 3));
                        setOptions(mappedOptions);
                    } else {
                        console.error(`Failed to load options for ${field.name}: ${response.status} ${response.statusText}`);
                    }
                } catch (error) {
                    console.error(`Error loading options for ${field.name}:`, error);
                } finally {
                    setIsLoadingOptions(false);
                }
            };

            loadOptions();
        }
    }, [
        field.type, 
        field.apiEndpoint, 
        field.name, 
        field.dependsOn,
        // Only re-run when the dependent field value changes, not all formData
        field.dependsOn && formData ? formData[field.dependsOn as keyof ContractorFormData] : null
    ]);

    // Reset dependent field when parent changes
    useEffect(() => {
        if (field.dependsOn && formData) {
            const dependentValue = formData[field.dependsOn as keyof ContractorFormData];
            if (!dependentValue && value) {
                onChange(field.name, '');
            }
        }
    }, [field.dependsOn, formData, field.name]);

    const isInvalid = invalidFields.has(field.name);
    const isDisabled = disabled || (field.dependsOn && formData && !formData[field.dependsOn as keyof ContractorFormData]) || false;

    const gridColClass = {
        full: 'col-span-full',
        half: 'md:col-span-1',
        third: 'md:col-span-1',
    }[field.gridCol || 'full'];

    const renderField = () => {
        switch (field.type) {
            case 'textarea':
                return (
                    <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        disabled={isDisabled}
                        required={field.required}
                        aria-invalid={isInvalid}
                        rows={field.rows || 3}
                        className={isInvalid ? 'border-red-300' : ''}
                    />
                );

            case 'select':
                return (
                    <Select
                        value={value}
                        onValueChange={(val) => onChange(field.name, val)}
                        disabled={isDisabled || isLoadingOptions}
                    >
                        <SelectTrigger
                            aria-invalid={isInvalid}
                            className={isInvalid ? 'border-red-300' : ''}
                        >
                            <SelectValue placeholder={isLoadingOptions ? 'در حال بارگذاری...' : field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.length === 0 && !isLoadingOptions ? (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                    {field.dependsOn ? 'ابتدا فیلد وابسته را انتخاب کنید' : 'موردی یافت نشد'}
                                </div>
                            ) : (
                                options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                );

            case 'date':
                return (
                    <PersianDatePicker
                        id={field.name}
                        value={value}
                        onChange={(date) => onChange(field.name, date)}
                        placeholder={field.placeholder}
                        disabled={isDisabled}
                    />
                );

            default:
                return (
                    <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        disabled={isDisabled}
                        required={field.required}
                        aria-invalid={isInvalid}
                        className={isInvalid ? 'border-red-300' : ''}
                        pattern={field.validation?.pattern?.source}
                        minLength={field.validation?.minLength}
                        maxLength={field.validation?.maxLength}
                    />
                );
        }
    };

    return (
        <Field className="gap-1">
            <FieldLabel className="gap-1 font-medium text-sm text-muted-foreground" htmlFor={field.name}>
                {field.required && <span className="text-red-500 mr-1">*</span>}
                {field.label}
            </FieldLabel>
            {renderField()}
            {isInvalid && field.validation?.message && (
                <FieldDescription className="text-right text-sm text-destructive mt-1">
                    {field.validation.message}
                </FieldDescription>
            )}
        </Field>
    );
}
