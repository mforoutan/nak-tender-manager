"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                            
                            {uploadedFiles[doc.id] ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="flex-1 text-sm truncate">
                                            {uploadedFiles[doc.id]?.name}
                                        </span>
                                        {uploadProgress[doc.id] === 100 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onFileDelete(doc.id)}
                                                disabled={!isEditable}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>
                                    {uploadProgress[doc.id] !== undefined && uploadProgress[doc.id] < 100 && (
                                        <div className="space-y-1">
                                            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className="bg-primary h-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress[doc.id]}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                در حال بارگذاری... {uploadProgress[doc.id]}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <FileUpload
                                    id={doc.id}
                                    onFileChange={(file) => onFileChange(doc.id, file)}
                                    disabled={!isEditable}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                            )}
                        </Field>
                    ))}
                </FieldGroup>
            </AccordionContent>
        </AccordionItem>
    );
}
