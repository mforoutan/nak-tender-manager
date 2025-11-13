"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { FileText } from "lucide-react";

interface DocumentsSectionProps {
    uploadedFiles: { [key: string]: File | null };
    uploadProgress: { [key: string]: number };
    onFileChange: (documentId: string, file: File | null) => void;
    onFileDelete: (documentId: string) => void;
    isEditable?: boolean;
}

const requiredDocuments = [
    { id: "registration", name: "اساسنامه شرکت", description: "آخرین نسخه اساسنامه شرکت" },
    { id: "newspaper", name: "روزنامه رسمی", description: "آخرین آگهی تغییرات در روزنامه رسمی" },
    { id: "tax", name: "گواهی مالیاتی", description: "آخرین گواهی مالیات بر ارزش افزوده" },
    { id: "certificate", name: "گواهینامه صلاحیت", description: "گواهینامه تأیید صلاحیت از مراجع ذیصلاح" },
];

export function DocumentsSection({
    uploadedFiles,
    uploadProgress,
    onFileChange,
    onFileDelete,
    isEditable = true,
}: DocumentsSectionProps) {
    return (
        <AccordionItem value="section-6" className="border rounded-md bg-white p-4 mt-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#F6F6F6] rounded-full">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">بارگذاری مدارک</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3">
                <FieldGroup className="gap-y-6">
                    {requiredDocuments.map((doc) => (
                        <Field key={doc.id} className="gap-2">
                            <FieldLabel className="font-medium text-sm text-muted-foreground">
                                <span className="text-red-500">*</span>
                                {doc.name}
                            </FieldLabel>
                            <FieldDescription className="text-xs text-muted-foreground">
                                {doc.description}
                            </FieldDescription>
                            
                            <FileUpload
                                id={doc.id}
                                onFileChange={(file) => onFileChange(doc.id, file)}
                                onDelete={() => onFileDelete(doc.id)}
                                disabled={!isEditable}
                                accept=".pdf,.jpg,.jpeg,.png"
                                file={uploadedFiles[doc.id]}
                                uploadProgress={uploadProgress[doc.id]}
                            />
                        </Field>
                    ))}
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    );
}
