"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building, User, Phone, CreditCard, UserCog } from "lucide-react";
import { FormFieldRenderer } from "./form-field-renderer";
import type { FormSectionConfig } from "@/types/form-fields";
import type { ContractorFormData } from "@/types";
import { FieldGroup } from "../ui/field";

interface FormSectionProps {
    section: FormSectionConfig;
    formData: ContractorFormData;
    onChange: (name: string, value: string) => void;
    disabled?: boolean;
    invalidFields?: Set<string>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Building,
    User,
    Phone,
    CreditCard,
    UserCog,
};

export function FormSection({
    section,
    formData,
    onChange,
    disabled = false,
    invalidFields = new Set(),
}: FormSectionProps) {
    const Icon = iconMap[section.icon] || Building;

    return (
        <AccordionItem value={section.id} className="border rounded-md bg-white p-4 mt-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#F6F6F6] rounded-full">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3">
                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => (
                        <FormFieldRenderer
                            key={field.name}
                            field={field}
                            value={formData[field.name as keyof ContractorFormData] || ''}
                            onChange={onChange}
                            formData={formData}
                            disabled={disabled}
                            invalidFields={invalidFields}
                        />
                    ))}
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    );
}
