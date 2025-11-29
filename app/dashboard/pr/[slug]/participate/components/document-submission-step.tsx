"use client"

import { useState } from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FileUp, Pencil, Plus, Trash2, Check, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileUpload } from "@/components/ui/file-upload"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup } from "@/components/ui/field"
import { PersianDatePicker } from "@/components/ui/persian-date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { alertStyles } from "@/components/alert-styles"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Guarantor {
  id: string
  guaranteeType: string
  number: string
  serial: string
  count: string
  issueDate: string
  endDate: string
  amount: string
}

interface DocumentData {
  file?: File | null
  guarantors?: Guarantor[]
  [key: string]: unknown
}

interface DocumentSubmissionStepProps {
  stepNumber: number
  document: {
    id: number
    docName: string
    submissionType: string
    isMandatory: boolean
  }
  data?: DocumentData
  onChange: (data: DocumentData) => void
  disabled?: boolean
}

export function DocumentSubmissionStep({
  stepNumber,
  document,
  data = {},
  onChange,
  disabled
}: DocumentSubmissionStepProps) {
  const [guarantors, setGuarantors] = useState<Guarantor[]>(data.guarantors || [])
  const [isAddingGuarantor, setIsAddingGuarantor] = useState(false)
  const [editingGuarantorId, setEditingGuarantorId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Guarantor>>({})

  const handleFieldChange = (field: string, value: unknown) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  const handleFormChange = (field: keyof Guarantor, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddGuarantor = () => {
    setIsAddingGuarantor(true)
    setFormData({
      guaranteeType: '',
      number: '',
      serial: '',
      count: '',
      issueDate: '',
      endDate: '',
      amount: ''
    })
  }

  const handleSaveGuarantor = () => {
    // Validate required fields
    if (!formData.guaranteeType) {
      toast.error("نوع تضمین الزامی است")
      return
    }

    const newGuarantor: Guarantor = {
      id: editingGuarantorId || Date.now().toString(),
      guaranteeType: formData.guaranteeType || '',
      number: formData.number || '',
      serial: formData.serial || '',
      count: formData.count || '',
      issueDate: formData.issueDate || '',
      endDate: formData.endDate || '',
      amount: formData.amount || ''
    }

    let updatedGuarantors: Guarantor[]
    if (editingGuarantorId) {
      updatedGuarantors = guarantors.map(g => g.id === editingGuarantorId ? newGuarantor : g)
      toast.success("تضمین با موفقیت ویرایش شد")
    } else {
      updatedGuarantors = [...guarantors, newGuarantor]
      toast.success("تضمین با موفقیت اضافه شد")
    }

    setGuarantors(updatedGuarantors)
    handleFieldChange('guarantors', updatedGuarantors)
    handleCancelForm()
  }

  const handleEditGuarantor = (guarantor: Guarantor) => {
    setEditingGuarantorId(guarantor.id)
    setFormData(guarantor)
    setIsAddingGuarantor(true)
  }

  const handleDeleteGuarantor = (id: string) => {
    const updatedGuarantors = guarantors.filter(g => g.id !== id)
    setGuarantors(updatedGuarantors)
    handleFieldChange('guarantors', updatedGuarantors)
    toast.success("تضمین حذف شد")
  }

  const handleCancelForm = () => {
    setIsAddingGuarantor(false)
    setEditingGuarantorId(null)
    setFormData({})
  }

  return (
    <>
      <Card className="bg-[#D0D7FA] rounded-lg p-6 gap-y-6">
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
              <Button 
                className="mb-8"
                onClick={handleAddGuarantor}
                disabled={disabled || isAddingGuarantor}
              >
                <Plus />
                <span>افزودن تضمین</span>
              </Button>

              {/* Add/Edit Guarantor Form */}
              {isAddingGuarantor && (
                <Card className="p-6 bg-background shadow-card-small mb-8">
                  <CardContent className="p-0 space-y-6">
                    <h4 className="font-bold mb-4">
                      {editingGuarantorId ? 'ویرایش تضمین' : 'افزودن تضمین جدید'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FieldGroup>
                        <Label>
                          نوع تضمین <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.guaranteeType}
                          onValueChange={(value) => handleFormChange('guaranteeType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ضمانت‌نامه بانکی">ضمانت‌نامه بانکی</SelectItem>
                            <SelectItem value="چک تضمینی">چک تضمینی</SelectItem>
                            <SelectItem value="سپرده نقدی">سپرده نقدی</SelectItem>
                            <SelectItem value="اوراق مشارکت">اوراق مشارکت</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldGroup>

                      <FieldGroup>
                        <Label>شماره</Label>
                        <Input
                          value={formData.number || ''}
                          onChange={(e) => handleFormChange('number', e.target.value)}
                          placeholder="شماره تضمین"
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label>سریال</Label>
                        <Input
                          value={formData.serial || ''}
                          onChange={(e) => handleFormChange('serial', e.target.value)}
                          placeholder="سریال"
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label>تعداد</Label>
                        <Input
                          type="number"
                          value={formData.count || ''}
                          onChange={(e) => handleFormChange('count', e.target.value)}
                          placeholder="تعداد"
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label>تاریخ صدور</Label>
                        <PersianDatePicker
                          value={formData.issueDate || ''}
                          onChange={(value) => handleFormChange('issueDate', value)}
                          placeholder="انتخاب تاریخ"
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label>تاریخ پایان</Label>
                        <PersianDatePicker
                          value={formData.endDate || ''}
                          onChange={(value) => handleFormChange('endDate', value)}
                          placeholder="انتخاب تاریخ"
                        />
                      </FieldGroup>

                      <FieldGroup className="md:col-span-2">
                        <Label>مبلغ تضمین</Label>
                        <Input
                          type="text"
                          value={formData.amount || ''}
                          onChange={(e) => handleFormChange('amount', e.target.value)}
                          placeholder="مبلغ به ریال"
                        />
                      </FieldGroup>
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        variant="outline"
                        onClick={handleCancelForm}
                      >
                        <X className="w-4 h-4" />
                        انصراف
                      </Button>
                      <Button onClick={handleSaveGuarantor}>
                        <Check className="w-4 h-4" />
                        {editingGuarantorId ? 'ذخیره تغییرات' : 'افزودن'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Saved Guarantor Cards */}
              <div className="space-y-4 mb-8">
                {guarantors.map((guarantor) => (
                  <Card key={guarantor.id} className="p-6 bg-background shadow-card-small">
                    <CardContent className="p-0 flex flex-col gap-y-8">
                      <h4 className="font-bold">{guarantor.guaranteeType}</h4>
                      <div className="flex gap-x-8">
                        <div className="flex flex-col flex-1 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">شماره:</span>
                            <span className="font-semibold">{guarantor.number || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">سریال:</span>
                            <span className="font-semibold">{guarantor.serial || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">تعداد:</span>
                            <span className="font-semibold">{guarantor.count || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">مبلغ:</span>
                            <span className="font-semibold">{guarantor.amount || '-'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 items-start gap-3 text-sm">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-muted-foreground">تاریخ صدور:</span>
                            <span className="font-semibold">{guarantor.issueDate || '-'}</span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-muted-foreground">تاریخ پایان:</span>
                            <span className="font-semibold">{guarantor.endDate || '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="border border-border-default px-4 py-3"
                          onClick={() => handleEditGuarantor(guarantor)}
                          disabled={disabled || isAddingGuarantor}
                        >
                          <Pencil />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="border border-border-default text-destructive hover:text-destructive px-4 py-3"
                          onClick={() => handleDeleteGuarantor(guarantor.id)}
                          disabled={disabled}
                        >
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
                  className="bg-[#FFFFFF]"
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
