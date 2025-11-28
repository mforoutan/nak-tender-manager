"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { FileText } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface DocumentsSectionProps {
    uploadedFiles: { [key: string]: File | null };
    uploadProgress: { [key: string]: number };
    onFileChange: (documentId: string, file: File | null) => void;
    onFileDelete: (documentId: string) => void;
    isEditable?: boolean;
}

const requiredDocuments = [
    { id: "registration", name: "اساسنامه شرکت", description: "اسناد و مستندات پروژه را در این قسمت بارگذاری کنید." },
    { id: "newspaper", name: "روزنامه رسمی", description: "اسناد و مستندات پروژه را در این قسمت بارگذاری کنید." },
    { id: "changes", name: "آگهی تغییرات", description: "اسناد و مستندات پروژه را در این قسمت بارگذاری کنید." },
];

export function DocumentsSection({
    uploadedFiles,
    uploadProgress,
    onFileChange,
    onFileDelete,
    isEditable = true,
}: DocumentsSectionProps) {
    return (
        <Card className="border rounded-md bg-white p-4 mt-3">
            <CardContent className="px-4 py-3">
                <FieldGroup className="gap-y-6">
                    {requiredDocuments.map((doc) => (
                        <Field key={doc.id} className="gap-1">
                            <FieldLabel className="font-medium text-sm text-muted-foreground">
                                <span className="text-red-500">*</span>
                                {doc.name}
                            </FieldLabel>
                            
                            <FileUpload
                                id={doc.id}
                                onFileChange={(file) => onFileChange(doc.id, file)}
                                onDelete={() => onFileDelete(doc.id)}
                                disabled={!isEditable}
                                accept=".pdf,.jpg,.jpeg,.png"
                                file={uploadedFiles[doc.id]}
                                uploadProgress={uploadProgress[doc.id]}
                                name={doc.name}
                                description={doc.description}
                            />
                        </Field>
                    ))}
                </FieldGroup>
            </CardContent>
        </Card>
    );
}
