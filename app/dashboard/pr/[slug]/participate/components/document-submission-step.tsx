"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { FileUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/ui/file-upload"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup } from "@/components/ui/field"

interface DocumentSubmissionStepProps {
  stepNumber: number
  document: {
    id: number
    docName: string
    submissionType: string
    isMandatory: boolean
  }
  data?: any
  onChange: (data: any) => void
  disabled?: boolean
}

export function DocumentSubmissionStep({ 
  stepNumber,
  document, 
  data = {},
  onChange,
  disabled 
}: DocumentSubmissionStepProps) {
  const handleFieldChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  return (
    <section 
      className="border rounded-md bg-white p-4"
    >
      <div className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F6F6F6] rounded-full">
              <FileUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">{document.docName}</h3>
          </div>
          {document.isMandatory && (
            <span className="text-xs text-red-500 font-semibold">* الزامی</span>
          )}
        </div>
      </div>
      <div className="px-4 py-3">
        <Card>
          <CardContent className="pt-6">
            {disabled && (
              <Alert className="mb-4">
                <AlertDescription>
                  برای تکمیل این بخش، ابتدا باید نسبت به خرید اسناد اقدام کنید
                </AlertDescription>
              </Alert>
            )}
            
            <FieldGroup className="space-y-4">
              <div className="space-y-2">
                <Label>عنوان مستندات</Label>
                <Input
                  value={data.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  disabled={disabled}
                  placeholder="عنوان مستندات را وارد کنید"
                />
              </div>

              <div className="space-y-2">
                <Label>توضیحات</Label>
                <Textarea
                  value={data.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  disabled={disabled}
                  placeholder="توضیحات مربوط به مستندات را وارد کنید"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>آپلود فایل {document.isMandatory && <span className="text-red-500">*</span>}</Label>
                <FileUpload
                  id={`doc-${document.id}`}
                  file={data.file}
                  onFileChange={(file: File | null) => handleFieldChange('file', file)}
                  disabled={disabled}
                  accept=".pdf,.doc,.docx,.zip"
                  maxSize={10}
                />
                <p className="text-xs text-muted-foreground">
                  فرمت‌های مجاز: PDF, DOC, DOCX, ZIP - حداکثر حجم: 10MB
                </p>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
