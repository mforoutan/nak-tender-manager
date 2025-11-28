"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Stepper } from "@/components/ui/stepper"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ContractorFormData } from "@/types"
import {
  InformationStep,
  ConfirmationStep,
  ReviewStep,
  RejectedStep,
  CompletedStep,
} from "./components"
import { DocumentsSection } from "@/components/contractor-form/documents-section"
import { CardContent, CardFooter } from "@/components/ui/card"
import { useSession } from "@/hooks/use-session"

const steps = [
  "تکمیل اطلاعات",
  "آپلود مدارک",
  "ثبت و ارسال جهت بررسی",
  "بررسی توسط کارشناس",
  "finish"
]

interface AccountClientProps {
  contractorId: number;
  initialData?: any;
}

export default function AccountClient({ contractorId, initialData }: AccountClientProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({})
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadedFileIds, setUploadedFileIds] = useState<{ [key: string]: number }>({})

  const { accountVerificationTask, refreshSession } = useSession()

  const [formData, setFormData] = useState<ContractorFormData>({
    companyName: "",
    companyNameEN: "",
    companyType: "",
    companyCategory: "",
    registrationNumber: "",
    economicCode: "",
    nationalId: "",
    establishmentDate: "",
    registrationPlace: "",
    insuranceBranch: "",
    ceoFirstName: "",
    ceoLastName: "",
    ceoNationalId: "",
    ceoMobile: "",
    phone: "",
    mobile: "",
    fax: "",
    email: "",
    postalCode: "",
    website: "",
    province: "",
    city: "",
    bankName: "",
    bankBranch: "",
    accountNumber: "",
    shabaNumber: "",
    repFirstName: "",
    repLastName: "",
    repPhone: "",
    repEmail: "",
  })

  const [taskStatus, setTaskStatus] = useState<string | null>(null)
  const [isEditable, setIsEditable] = useState(true)
  const [rejectionReason, setRejectionReason] = useState<string>("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<{
    documentId: string;
    fileId?: number;
  } | null>(null)
  const [stepInitialized, setStepInitialized] = useState(false)

  // Set task status and step from session (only on initial load)
  useEffect(() => {
    if (accountVerificationTask && !stepInitialized) {
      if (accountVerificationTask.hasTask) {
        setTaskStatus(accountVerificationTask.status);
        setRejectionReason(accountVerificationTask.rejectionReason || '');
        
        // Set initial step based on status
        if (accountVerificationTask.status === 'PENDING' || accountVerificationTask.status === 'IN_PROGRESS') {
          setIsEditable(false);
          setCurrentStep(3);
        } else if (accountVerificationTask.status === 'COMPLETED') {
          setIsEditable(false);
          setCurrentStep(5);
        } else if (accountVerificationTask.status === 'REJECTED') {
          setIsEditable(true);
          setCurrentStep(2);
        }
        setStepInitialized(true);
      }
    }
  }, [accountVerificationTask, stepInitialized]);

  // Load initial data or fetch contractor data
  useEffect(() => {
    if (initialData) {
      processContractorData(initialData)
      setIsLoading(false)
    } else {
      fetchContractorData()
    }
  }, [])

  const processContractorData = (data: any) => {
    if (data.contractor) {
      const contractor = data.contractor

      setFormData({
        companyName: contractor.COMPANY_NAME || '',
        companyNameEN: contractor.COMPANY_NAME_EN || '',
        nationalId: contractor.NATIONAL_ID || '',
        economicCode: contractor.ECONOMIC_CODE || '',
        registrationNumber: contractor.REGISTRATION_NUMBER || '',
        establishmentDate: contractor.ESTABLISHMENT_DATE ?
          new Date(contractor.ESTABLISHMENT_DATE).toISOString().split('T')[0] : '',
        phone: contractor.PHONE || '',
        mobile: contractor.MOBILE || '',
        fax: contractor.FAX || '',
        email: contractor.EMAIL || '',
        website: contractor.WEBSITE || '',
        postalCode: contractor.POSTAL_CODE || '',
        province: contractor.PROVINCE_ID?.toString() || '',
        city: contractor.CITY_ID?.toString() || '',
        bankName: contractor.BANK_ID?.toString() || '',
        accountNumber: contractor.BANK_ACCOUNT || '',
        shabaNumber: contractor.SHABA_NUMBER || '',
        bankBranch: contractor.BRANCH_ACCOUNT || '',
        companyType: contractor.CONTRACTOR_TYPE_ID?.toString() || '',
        companyCategory: contractor.CONTRACTOR_CATEGORY_ID?.toString() || '',
        registrationPlace: contractor.REGISTRATION_PLACE || '',
        insuranceBranch: contractor.INSURANCE_BRANCH || '',
        ceoFirstName: '',
        ceoLastName: '',
        ceoNationalId: '',
        ceoMobile: '',
        repFirstName: '',
        repLastName: '',
        repPhone: '',
        repEmail: '',
      })

      // Extract CEO and Rep info from members
      if (data.members && Array.isArray(data.members)) {
        data.members.forEach((member: any) => {
          if (member.POSITION_TITLE === 'CEO') {
            setFormData(prev => ({
              ...prev,
              ceoFirstName: member.FIRST_NAME || '',
              ceoLastName: member.LAST_NAME || '',
              ceoNationalId: member.NATIONAL_ID || '',
              ceoMobile: member.MOBILE || '',
            }))
          } else if (member.POSITION_TITLE?.includes('REP')) {
            setFormData(prev => ({
              ...prev,
              repFirstName: member.FIRST_NAME || '',
              repLastName: member.LAST_NAME || '',
              repPhone: member.PHONE || '',
              repEmail: member.EMAIL || '',
            }))
          }
        })
      }

      // Handle documents
      if (data.documents && Array.isArray(data.documents)) {
        const filesMap: { [key: string]: File | null } = {}
        const fileIdsMap: { [key: string]: number } = {}

        data.documents.forEach((doc: any) => {
          let docType = ''

          if (doc.CERTIFICATE_TYPE === 'LEGAL' && doc.CERTIFICATE_NAME?.includes('اساسنامه')) {
            docType = 'registration'
          } else if (doc.CERTIFICATE_TYPE === 'LEGAL' && doc.CERTIFICATE_NAME?.includes('روزنامه')) {
            docType = 'newspaper'
          } else if (doc.CERTIFICATE_TYPE === 'TAX') {
            docType = 'tax'
          } else if (doc.CERTIFICATE_TYPE === 'QUALIFICATION') {
            docType = 'certificate'
          }

          if (docType && doc.FILE_NAME) {
            filesMap[docType] = {
              name: doc.ORIGINAL_NAME || doc.FILE_NAME,
              size: doc.FILE_SIZE || 0,
              type: doc.MIME_TYPE || 'application/octet-stream',
            } as File
            fileIdsMap[docType] = doc.CERTIFICATE_FILE_ID

            setUploadProgress(prev => ({ ...prev, [docType]: 100 }))
          }
        })

        if (Object.keys(filesMap).length > 0) {
          setUploadedFiles(prev => ({ ...prev, ...filesMap }))
          setUploadedFileIds(prev => ({ ...prev, ...fileIdsMap }))
        }
      }

      // Check for tasks and set status (only if not already set from session)
      if (data.tasks && data.tasks.length > 0 && !accountVerificationTask) {
        const latestTask = data.tasks[0]
        const status = latestTask.STATUS

        setTaskStatus(status)

        if (status === 'PENDING' || status === 'IN_PROGRESS') {
          setIsEditable(false)
          setCurrentStep(3)
        } else if (status === 'COMPLETED') {
          setIsEditable(false)
          setCurrentStep(5)
        } else if (status === 'REJECTED') {
          setIsEditable(true)
          setCurrentStep(2)
          setRejectionReason(latestTask.REJECTION_REASON || '')
        }
        setStepInitialized(true)
      }
    }
  }

  const fetchContractorData = async () => {
    try {
      const response = await fetch(`/api/account/profile?id=${contractorId}`)
      if (response.ok) {
        const data = await response.json()
        processContractorData(data)
      }
    } catch (error) {
      console.error("Error fetching contractor data:", error)
      toast.error("خطا در بارگذاری اطلاعات")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormDataChange = (field: keyof ContractorFormData, value: string) => {
    if (!isEditable) {
      toast.error("امکان ویرایش اطلاعات وجود ندارد")
      return
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (documentId: string, file: File | null) => {
    if (!isEditable) {
      toast.error("امکان ویرایش اطلاعات وجود ندارد")
      return
    }

    if (!file) {
      setUploadedFiles(prev => {
        const newFiles = { ...prev }
        delete newFiles[documentId]
        return newFiles
      })
      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[documentId]
        return newProgress
      })
    } else {
      setUploadedFiles(prev => ({ ...prev, [documentId]: file }))
      setUploadProgress(prev => ({ ...prev, [documentId]: 0 }))

      // Auto-upload
      setTimeout(() => {
        uploadFile(documentId, file)
      }, 100)
    }
  }

  const uploadFile = async (documentId: string, file: File) => {
    setUploadProgress(prev => ({ ...prev, [documentId]: 10 }))

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)
      formDataToSend.append('documentType', documentId)
      formDataToSend.append('contractorId', contractorId.toString())

      setUploadProgress(prev => ({ ...prev, [documentId]: 50 }))

      const response = await fetch('/api/account/upload', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadProgress(prev => ({ ...prev, [documentId]: 100 }))
        if (data.fileId) {
          setUploadedFileIds(prev => ({ ...prev, [documentId]: data.fileId }))
        }
        toast.success(`${file.name} با موفقیت بارگذاری شد`)
      } else {
        setUploadProgress(prev => ({ ...prev, [documentId]: 0 }))
        toast.error(data.error || 'خطا در بارگذاری فایل')
        setUploadedFiles(prev => {
          const newFiles = { ...prev }
          delete newFiles[documentId]
          return newFiles
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadProgress(prev => ({ ...prev, [documentId]: 0 }))
      toast.error('خطا در برقراری ارتباط با سرور')
      setUploadedFiles(prev => {
        const newFiles = { ...prev }
        delete newFiles[documentId]
        return newFiles
      })
    }
  }

  const handleFileDelete = (documentId: string) => {
    const fileId = uploadedFileIds[documentId]
    setFileToDelete({ documentId, fileId })
    setShowDeleteDialog(true)
  }

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return

    const { documentId, fileId } = fileToDelete

    if (!fileId) {
      toast.error('شناسه فایل یافت نشد')
      setShowDeleteDialog(false)
      setFileToDelete(null)
      return
    }

    try {
      const response = await fetch('/api/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      })

      const data = await response.json()

      if (response.ok) {
        setUploadedFiles(prev => {
          const newFiles = { ...prev }
          delete newFiles[documentId]
          return newFiles
        })
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[documentId]
          return newProgress
        })
        setUploadedFileIds(prev => {
          const newIds = { ...prev }
          delete newIds[documentId]
          return newIds
        })
        toast.success('فایل با موفقیت حذف شد')
      } else {
        toast.error(data.error || 'خطا در حذف فایل')
      }
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error('خطا در برقراری ارتباط با سرور')
    } finally {
      setShowDeleteDialog(false)
      setFileToDelete(null)
    }
  }

  const handleSaveDraft = async () => {
    if (!isEditable) {
      toast.error("امکان ویرایش اطلاعات وجود ندارد")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/account/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, contractorId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'تغییرات ذخیره شد')
      } else {
        toast.error(data.error || 'خطا در ذخیره پیش‌نویس')
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      toast.error('خطا در برقراری ارتباط با سرور')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = () => {
    if (currentStep < 2 && isEditable) {
      setCurrentStep(prev => prev + 2)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0 && isEditable) {
      setCurrentStep(prev => prev - 2)
    }
  }

  const handleSubmit = async () => {
    if (!isEditable) {
      toast.error("امکان ارسال مجدد اطلاعات وجود ندارد")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/account/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, contractorId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh session to get updated task status
        await refreshSession(['accountVerificationTask']);
        
        setShowSuccessDialog(true)
        setIsEditable(false)
        setCurrentStep(2)
        setTaskStatus('PENDING')
      } else {
        toast.error(data.error || 'خطا در ثبت اطلاعات')
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error('خطا در برقراری ارتباط با سرور')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = () => {
    setCurrentStep(0)
    setIsEditable(true)
    setTaskStatus(null)
  }

  const renderStatusAlert = () => {
    if (!taskStatus || taskStatus === 'REJECTED') {
      return (
        <Alert className="border-black" variant={`destructive`}>
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">فعال کردن حساب کاربری</AlertTitle>
          <AlertDescription className="*:text-black">
            {taskStatus === 'REJECTED'
              ? 'اطلاعات شما نیاز به اصلاح دارد. لطفاً موارد را بررسی و مجدداً ارسال کنید.'
              : (
                <p>
                  تکمیل اطلاعات ستاره‌دار
                  &nbsp;<span className="text-destructive">
                    (*)
                  </span>&nbsp;
                  در فرم زیر برای شرکت در مناقصات، استعلام‌ها و فراخوان‌ها الزامی است. شرکت شما بر اساس این اطلاعات ابتدا توسط ناک ارزیابی و سپس به‌عنوان واجد شرایط برای شرکت در معاملات اعلام خواهد شد.
                </p>
              )}
          </AlertDescription>
        </Alert>
      )
    }

    if (taskStatus === 'PENDING' || taskStatus === 'IN_PROGRESS') {
      return (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-700" />
          <AlertTitle className="text-blue-700">در حال بررسی</AlertTitle>
          <AlertDescription className="text-blue-600">
            اطلاعات شما در حال بررسی توسط کارشناسان است. امکان ویرایش وجود ندارد.
          </AlertDescription>
        </Alert>
      )
    }

    if (taskStatus === 'COMPLETED') {
      return (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-700" />
          <AlertTitle className="text-green-700">حساب فعال</AlertTitle>
          <AlertDescription className="text-green-600">
            حساب کاربری شما تأیید شده و فعال است.
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Spinner className="h-12 w-12 mx-auto" />
          <p className="mt-4 text-muted-foreground">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 lg:px-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">حساب کاربری</h1>
      </div>

      {renderStatusAlert()}

      <div className="bg-[#F6F6F6] rounded-2xl p-4 md:p-8 lg:p-12">
        <Stepper className="max-w-4xl mx-auto" steps={steps} currentStep={currentStep} lastStepVariant="large" />

        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold">مرحله اول: تکمیل اطلاعات</h2>
        </div>

        <div className="pt-6">
          {currentStep === 0 && (
            <>
              <CardContent className="p-0">

                <InformationStep
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                  uploadedFiles={uploadedFiles}
                  uploadProgress={uploadProgress}
                  onFileChange={handleFileChange}
                  onFileDelete={handleFileDelete}
                  onNext={handleNext}
                  onSaveDraft={handleSaveDraft}
                  isEditable={isEditable}
                  isSaving={isSaving}
                />


                <div className="mt-12 mb-8">
                  <h2 className="text-xl font-bold">مرحله دوم: آپلود اسناد و مدارک</h2>
                </div>

                <DocumentsSection
                  uploadedFiles={uploadedFiles}
                  uploadProgress={uploadProgress}
                  onFileChange={handleFileChange}
                  onFileDelete={handleFileDelete}
                  isEditable={isEditable}
                />
              </CardContent>
              <CardFooter className="flex justify-between mt-6 p-0">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={!isEditable || isSaving}
                  className="bg-transparent font-semibold"
                >
                  {isSaving ? "در حال ذخیره..." : "ذخیره پیش‌نویس"}
                </Button>
                <Button onClick={handleNext} disabled={!isEditable}>
                  مرحله بعد
                </Button>
              </CardFooter>
            </>
          )}

          {currentStep === 2 && (
            <>
              <ConfirmationStep
                formData={formData}
                uploadedFiles={uploadedFiles}
                uploadedFileIds={uploadedFileIds}
                onPrevious={handlePrevious}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
              <CardFooter className="flex justify-between mt-6 p-0">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="bg-transparent font-semibold"
                >
                  مرحله قبل
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "در حال ارسال..." : "تأیید و ارسال"}
                </Button>
              </CardFooter>
            </>
          )}

          {currentStep === 3 && taskStatus === 'REJECTED' && (
            <RejectedStep
              onEdit={handleEdit}
              rejectionReason={rejectionReason}
            />
          )}

          {currentStep === 3 && taskStatus !== 'REJECTED' && (
            <ConfirmationStep
              formData={formData}
              uploadedFiles={uploadedFiles}
              uploadedFileIds={uploadedFileIds}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep >= 4 && taskStatus === 'COMPLETED' && (
            <ConfirmationStep
              formData={formData}
              uploadedFiles={uploadedFiles}
              uploadedFileIds={uploadedFileIds}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              isSubmitting={true}
            />
          )}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                درخواست شما با موفقیت ثبت شد
              </h3>
              <p className="text-sm text-gray-600">
                اطلاعات شما در حال بررسی توسط کارشناسان است. نتیجه بررسی از طریق ایمیل به اطلاع شما خواهد رسید.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              متوجه شدم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              حذف فایل
            </DialogTitle>
            <DialogDescription className="pt-4 text-base">
              آیا از حذف این فایل اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setFileToDelete(null)
              }}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteFile}
            >
              حذف فایل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
