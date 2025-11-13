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

const steps = [
  "تکمیل اطلاعات و آپلود مدارک",
  "ثبت و ارسال جهت بررسی", 
  "بررسی توسط کارشناس"
]

interface AccountPageProps {
  accountStatus?: {
    hasTask: boolean;
    status: string | null;
  };
  isCheckingStatus?: boolean;
}

export default function AccountPage({ accountStatus, isCheckingStatus }: AccountPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({})
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [uploadedFileIds, setUploadedFileIds] = useState<{[key: string]: number}>({})
  
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

  // Fetch contractor data on mount
  useEffect(() => {
    const fetchContractorData = async () => {
      try {
        const response = await fetch('/api/account/profile?id=301')
        if (response.ok) {
          const data = await response.json()
          console.log("API Response:", data)
          
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
              const filesMap: {[key: string]: File | null} = {}
              const fileIdsMap: {[key: string]: number} = {}
              
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
            
            // Check for tasks and set status
            if (data.tasks && data.tasks.length > 0) {
              const latestTask = data.tasks[0]
              const status = latestTask.STATUS
              
              setTaskStatus(status)
              
              if (status === 'PENDING' || status === 'IN_PROGRESS') {
                setIsEditable(false)
                setCurrentStep(2)
              } else if (status === 'COMPLETED') {
                setIsEditable(false)
                setCurrentStep(3)
              } else if (status === 'REJECTED') {
                setIsEditable(true)
                setCurrentStep(2)
                setRejectionReason(latestTask.REJECTION_REASON || '')
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching contractor data:", error)
        toast.error("خطا در بارگذاری اطلاعات")
      } finally {
        setIsLoading(false)
      }
    }

    fetchContractorData()
  }, [])

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
      formDataToSend.append('contractorId', '301')
      
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
        body: JSON.stringify({ ...formData, contractorId: 301 }),
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
    if (currentStep < 1 && isEditable) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0 && isEditable) {
      setCurrentStep(prev => prev - 1)
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
        body: JSON.stringify({ ...formData, contractorId: 301 }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
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
    if (isCheckingStatus) return null
    
    if (!accountStatus?.hasTask || accountStatus.status === 'REJECTED') {
      return (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-700" />
          <AlertTitle className="text-amber-700">تکمیل اطلاعات حساب کاربری</AlertTitle>
          <AlertDescription className="text-amber-600">
            {accountStatus?.status === 'REJECTED' 
              ? 'اطلاعات شما نیاز به اصلاح دارد. لطفاً موارد را بررسی و مجدداً ارسال کنید.'
              : 'لطفاً اطلاعات حساب کاربری خود را تکمیل کنید تا بتوانید از امکانات سامانه استفاده نمایید.'}
          </AlertDescription>
        </Alert>
      )
    }

    if (accountStatus.status === 'PENDING' || accountStatus.status === 'IN_PROGRESS') {
      return (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-700" />
          <AlertTitle className="text-blue-700">در حال بررسی</AlertTitle>
          <AlertDescription className="text-blue-600">
            اطلاعات شما در حال بررسی توسط کارشناسان است. امکان ویرایش وجود ندارد.
          </AlertDescription>
        </Alert>
      )
    }

    if (accountStatus.status === 'COMPLETED') {
      return (
        <Alert className="mb-4 bg-green-50 border-green-200">
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
    <div className="space-y-6 px-4 lg:px-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">حساب کاربری</h1>
        <p className="text-muted-foreground">
          لطفاً اطلاعات خود را به طور کامل وارد نمایید
        </p>
      </div>

      {renderStatusAlert()}

      <div className="bg-[#F6F6F6] rounded-2xl p-4 md:p-8 lg:p-12">
        <Stepper steps={steps} currentStep={currentStep} />
        
        <div className="mt-6 mb-4">
          <h2 className="text-xl font-bold">{steps[currentStep]}</h2>
          <p className="text-muted-foreground mt-1">
            {currentStep === 0 && "لطفاً اطلاعات و مدارک خواسته شده را با دقت وارد و بارگذاری نمایید"}
            {currentStep === 1 && "اطلاعات وارد شده را بررسی و تأیید نمایید"}
            {currentStep === 2 && taskStatus === 'REJECTED' && "اطلاعات نیاز به اصلاح دارد"}
            {currentStep === 2 && (taskStatus === 'PENDING' || taskStatus === 'IN_PROGRESS') && "اطلاعات شما در حال بررسی توسط کارشناسان است"}
            {currentStep === 3 && "حساب کاربری شما فعال شد"}
          </p>
        </div>

        <div className="pt-6">
          {currentStep === 0 && (
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
          )}

          {currentStep === 1 && (
            <ConfirmationStep
              formData={formData}
              uploadedFiles={uploadedFiles}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 2 && taskStatus === 'REJECTED' && (
            <RejectedStep
              onEdit={handleEdit}
              rejectionReason={rejectionReason}
            />
          )}

          {currentStep === 2 && (taskStatus === 'PENDING' || taskStatus === 'IN_PROGRESS' || taskStatus === null) && (
            <ReviewStep />
          )}

          {currentStep === 3 && taskStatus === 'COMPLETED' && (
            <CompletedStep />
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
          <DialogFooter className="gap-2 sm:gap-0">
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
