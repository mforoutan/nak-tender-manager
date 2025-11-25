"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FileUp, Pencil, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileUpload } from "@/components/ui/file-upload"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup } from "@/components/ui/field"

import { alertStyles } from "@/components/alert-styles"
import { Button } from "@/components/ui/button"

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
    <>
      <Card className="bg-[#D0D7FA] p-6 gap-y-6">
        <CardHeader className="p-0 flex gap-2 items-center">
          <h3 className="text-lg font-semibold">{document.docName}</h3>
          {document.isMandatory && (
            <span className="text-xs text-red-500 font-semibold">* الزامی</span>
          )}
        </CardHeader>
        {document.submissionType === 'PHYSICAL' ? (
          <>
            <Alert className={`${alertStyles.info.className} bg-background text-[#042EFF] border border-[#042EFF]`}>
              {alertStyles.info.icon}
              <AlertTitle className="text-[#042EFF]  font-bold">توجه</AlertTitle>
              <AlertDescription className="inline text-[#042EFF] text-sm">
                ارسال
                &nbsp;{document.docName}&nbsp;
                به صورت فیزیکی است.
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <>
            <Alert className={`${alertStyles.info.className} bg-background text-[#042EFF] border border-[#042EFF]`}>
              {alertStyles.info.icon}
              <AlertTitle className="text-[#042EFF]  font-bold">توجه</AlertTitle>
              <AlertDescription className="inline text-[#042EFF] text-sm">
                جهت بررسى تضمين شركت درفرايند معاملاتى
                &nbsp;{document.docName}&nbsp;
                لطفا اطلاعات مربوط به تضامین را اضافه کنید.
                <span className="font-semibold mr-1">
                  و در انتها
                  &nbsp;{document.docName}&nbsp;
                  خود را بارگذارى بفرماييد.
                </span>
              </AlertDescription>
            </Alert>
            <CardContent className="p-0">
              <Button className="mb-8">
                <Plus />
                <span>افزودن تضمین</span>
              </Button>

              {/* Guarantee Cards */}
              <div className="space-y-4 mb-8">
                {/* Mock guarantee data - replace with actual data */}
                {[
                  {
                    id: 1,
                    title: 'ج - اوراق مشاركت بى نام',
                    number: "۳",
                    bank: "-",
                    branch: "-",
                    amount: "-",
                    guaranteeType: "-",
                    issueDate: "۱۴۰۵/۰۳/۰۳"
                  }
                ].map((guarantee) => (
                  <Card key={guarantee.id} className="p-6 bg-background shadow-card-small">
                    <CardContent className="p-0 flex flex-col gap-y-8">
                      <h4 className="font-bold">{guarantee.title}</h4>
                      <div className="flex gap-x-8">
                        <div className="flex flex-col flex-1 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">شماره:</span>
                            <span className="font-semibold">{guarantee.number}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">مبلغ:</span>
                            <span className="font-semibold">{guarantee.amount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">اسناد و تاریخ صدور:</span>
                            <span className="font-semibold">{guarantee.issueDate}</span>
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 items-start gap-3 text-sm">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-muted-foreground">بانک و شعبه:</span>
                            <span className="font-semibold">{guarantee.bank} / {guarantee.branch}</span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-muted-foreground">ضمانت گذار:</span>
                            <span className="font-semibold">{guarantee.guaranteeType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end">
                        <Button variant="ghost" size="icon" className="border border-border-default px-4 py-3">
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon" className="border border-border-default text-destructive hover:text-destructive px-4 py-3">
                          <Trash2 />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <FieldGroup className="space-y-4">
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
                </div>
              </FieldGroup>
            </CardContent>
          </>
        )}
      </Card>
    </>
  )
}
