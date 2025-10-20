"use client"

import React, { useState, useEffect } from "react"
import { 
  Building, 
  User, 
  Phone, 
  CreditCard, 
  UserCog, 
  FileText, 
  AlertCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Stepper } from "@/components/ui/stepper"
import { toast } from "sonner"
import { ContractorFormData } from "@/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Spinner } from "@/components/ui/spinner"
import { PersianDatePicker } from "@/components/ui/persian-date-picker"
import { TaskStatusDialog } from "@/components/task-status-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { FileUpload } from "@/components/ui/file-upload"

const steps = ["تکمیل اطلاعات و آپلود مدارک", "ثبت و ارسال جهت بررسی", "بررسی توسط کارشناس"]


const requiredDocuments = [
  { id: "registration", name: "اساسنامه شرکت", description: "آخرین نسخه اساسنامه شرکت" },
  { id: "newspaper", name: "روزنامه رسمی", description: "آخرین آگهی تغییرات در روزنامه رسمی" },
  { id: "tax", name: "گواهی مالیاتی", description: "آخرین گواهی مالیات بر ارزش افزوده" },
  { id: "certificate", name: "گواهینامه صلاحیت", description: "گواهینامه تأیید صلاحیت از مراجع ذیصلاح" },
]

export default function AccountPage() {

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({})
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  // Keep track of open accordion items
  const [openSections, setOpenSections] = useState<string[]>(["section-1"])
  
  const [formData, setFormData] = useState<ContractorFormData>({
    // اطلاعات اصلی (Main Information)
    companyName: "",
    companyType: "",
    registrationNumber: "",
    economicCode: "",
    nationalId: "",
    establishmentDate: "",

    // اطلاعات مدیر عامل (CEO Information)
    ceoFirstName: "",
    ceoLastName: "",
    ceoNationalId: "",
    ceoBirthDate: "",
    ceoMobile: "",
    ceoPosition: "",

    // اطلاعات تماس (Contact Information)
    phone: "",
    fax: "",
    email: "",
    address: "",
    postalCode: "",
    website: "",

    // اطلاعات بانکی (Banking Information)
    bankName: "",
    accountNumber: "",
    ibanNumber: "",
    branchName: "",
    branchCode: "",

    // اطلاعات نماینده (Representative Information)
    repFirstName: "",
    repLastName: "",
    repNationalId: "",
    repPhone: "",
    repEmail: "",
    repPosition: "",
  })

  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Fetch contractor data on component mount
  useEffect(() => {
    const fetchContractorData = async () => {
      try {
        const response = await fetch('/api/account/profile?id=301')
        if (response.ok) {
          const data = await response.json()
          console.log("API Response:", data);
          
          if (data.contractor) {
            const contractor = data.contractor;
            
            setFormData({
              companyName: contractor.COMPANY_NAME || '',
              nationalId: contractor.NATIONAL_ID || '',
              economicCode: contractor.ECONOMIC_CODE || '',
              registrationNumber: contractor.REGISTRATION_NUMBER || '',
              establishmentDate: contractor.ESTABLISHMENT_DATE ? 
                new Date(contractor.ESTABLISHMENT_DATE).toISOString().split('T')[0] : '',
              phone: contractor.PHONE || '',
              fax: contractor.FAX || '',
              email: contractor.EMAIL || '',
              website: contractor.WEBSITE || '',
              address: contractor.ADDRESS || '',
              postalCode: contractor.POSTAL_CODE || '',
              bankName: contractor.BANK_ID?.toString() || '',
              accountNumber: contractor.BANK_ACCOUNT || '',
              ibanNumber: contractor.SHABA_NUMBER || '',
              branchName: contractor.BRANCH_ACCOUNT || '',
              branchCode: '',
              companyType: '',
              ceoFirstName: '',
              ceoLastName: '',
              ceoNationalId: '',
              ceoBirthDate: '',
              ceoMobile: '',
              ceoPosition: '',
              repFirstName: '',
              repLastName: '',
              repNationalId: '',
              repPhone: '',
              repEmail: '',
              repPosition: '',
            });
            
            // Extract CEO and Rep info from members
            if (data.members && Array.isArray(data.members)) {
              data.members.forEach(member => {
                if (member.POSITION_TITLE === 'CEO') {
                  setFormData(prev => ({
                    ...prev,
                    ceoFirstName: member.FIRST_NAME || '',
                    ceoLastName: member.LAST_NAME || '',
                    ceoNationalId: member.NATIONAL_ID || '',
                    ceoMobile: member.MOBILE || '',
                    ceoPosition: 'مدیر عامل',
                  }));
                } else if (member.POSITION_TITLE?.includes('REP')) {
                  setFormData(prev => ({
                    ...prev,
                    repFirstName: member.FIRST_NAME || '',
                    repLastName: member.LAST_NAME || '',
                    repNationalId: member.NATIONAL_ID || '',
                    repPhone: member.PHONE || '',
                    repEmail: member.EMAIL || '',
                    repPosition: member.POSITION_TITLE || '',
                  }));
                }
              });
            }
            
            // Handle documents
            if (data.documents && Array.isArray(data.documents)) {
              const filesMap = {};
              
              data.documents.forEach(doc => {
                let docType = '';
                
                if (doc.CERTIFICATE_TYPE === 'LEGAL' && doc.CERTIFICATE_NAME?.includes('اساسنامه')) {
                  docType = 'registration';
                } else if (doc.CERTIFICATE_TYPE === 'LEGAL' && doc.CERTIFICATE_NAME?.includes('روزنامه')) {
                  docType = 'newspaper';
                } else if (doc.CERTIFICATE_TYPE === 'TAX') {
                  docType = 'tax';
                } else if (doc.CERTIFICATE_TYPE === 'QUALIFICATION') {
                  docType = 'certificate';
                }
                
                if (docType && doc.FILE_NAME) {
                  filesMap[docType] = {
                    name: doc.ORIGINAL_NAME || doc.FILE_NAME,
                    size: doc.FILE_SIZE || 0,
                    type: doc.MIME_TYPE || 'application/octet-stream',
                  };
                  
                  setUploadProgress(prev => ({ ...prev, [docType]: 100 }));
                }
              });
              
              if (Object.keys(filesMap).length > 0) {
                setUploadedFiles(prev => ({ ...prev, ...filesMap }));
              }
            }
            
            // Check for tasks and set status
            if (data.tasks && data.tasks.length > 0) {
              const latestTask = data.tasks[0];
              const status = latestTask.STATUS;
              
              setTaskStatus(status);
              
              if (status === 'PENDING' || status === 'IN_PROGRESS') {
                setIsEditable(false);
                setCurrentStep(2);
                setStatusMessage("اطلاعات شما در حال بررسی است و امکان ویرایش وجود ندارد.");
              } else if (status === 'COMPLETED') {
                setIsEditable(false);
                setCurrentStep(3); // Set to completed step (step 4 which is index 3)
                setStatusMessage("اطلاعات شما تایید شده است.");
              } else if (status === 'REJECTED') {
                setIsEditable(true);
                setCurrentStep(0);
                setStatusMessage("اطلاعات شما نیاز به اصلاح دارد. لطفا موارد را بررسی و مجددا ارسال نمایید.");
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

  // Add function to fetch task status
  const fetchTaskStatus = async () => {
    try {
      const response = await fetch(`/api/tasks/status?contractorId=301&t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Task status:", data);
        
        if (data.task) {
          const status = data.task.status;
          setTaskStatus(status);
          
          // If status is PENDING or IN_PROGRESS, stay on step 2
          if (status === "PENDING" || status === "IN_PROGRESS") {
            setIsEditable(false);
            setStatusMessage("اطلاعات شما در حال بررسی است و امکان ویرایش وجود ندارد.");
            if (currentStep < 2) setCurrentStep(2);
          } else if (status === "COMPLETED") {
            setIsEditable(false);
            setStatusMessage("اطلاعات شما تایید شده است.");
            // Move to completed step
            setCurrentStep(3);
          } else if (status === "REJECTED") {
            setIsEditable(true);
            setCurrentStep(0);
            setStatusMessage("اطلاعات شما نیاز به اصلاح دارد. لطفا موارد را بررسی و مجددا ارسال نمایید.");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching task status:", error);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && isEditable && 
      !(taskStatus && (taskStatus === 'PENDING' || taskStatus === 'COMPLETED'))) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0 && isEditable && !taskStatus) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = async () => {
    if (!isEditable) {
      toast.error("امکان ویرایش اطلاعات وجود ندارد");
      return;
    }
    
    setIsSaving(true)
    try {
      const response = await fetch('/api/account/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          contractorId: 301 // Always update the existing record
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(data.message)
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

  const handleSubmit = async () => {
    if (!isEditable) {
      toast.error("امکان ارسال مجدد اطلاعات وجود ندارد");
      return;
    }
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/account/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          contractorId: 301
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Show success dialog
        setShowSuccessDialog(true);
        
        // Fetch the latest task status after successful submission
        await fetchTaskStatus();
        
        // Move to the completed step
        setIsEditable(false);
        setCurrentStep(2);
        setStatusMessage("اطلاعات شما در حال بررسی است و امکان ویرایش وجود ندارد.");
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

  const updateFormData = (field: string, value: string) => {
    if (!isEditable) {
      toast.error("امکان ویرایش اطلاعات وجود ندارد");
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (documentId: string, file: File | null) => {
    if (!file) {
      // Remove file from uploadedFiles if null
      setUploadedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[documentId];
        return newFiles;
      });
      // Reset progress
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[documentId];
        return newProgress;
      });
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [documentId]: file
      }));
      // Reset progress when new file is selected
      setUploadProgress(prev => ({
        ...prev,
        [documentId]: 0
      }));
    }
  }

  const uploadFile = async (documentId: string) => {
    const file = uploadedFiles[documentId]
    if (!file) return
    
    // Don't upload if already uploaded
    if (uploadProgress[documentId] === 100) {
      toast.info("این فایل قبلاً بارگذاری شده است");
      return;
    }
    
    setUploadProgress(prev => ({ ...prev, [documentId]: 0 }))
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentId)
      formData.append('contractorId', '301')
      
      const response = await fetch('/api/account/upload', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setUploadProgress(prev => ({ ...prev, [documentId]: 100 }))
        toast.success(`${file.name} با موفقیت بارگذاری شد`)
      } else {
        setUploadProgress(prev => ({ ...prev, [documentId]: 0 }))
        toast.error(data.error || 'خطا در بارگذاری فایل')
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadProgress(prev => ({ ...prev, [documentId]: 0 }))
      toast.error('خطا در برقراری ارتباط با سرور')
    }
  }

  const deleteFile = async (documentId: string) => {
    try {
      const response = await fetch('/api/account/delete-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType: documentId,
          contractorId: '301'
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Remove file from state
        setUploadedFiles(prev => {
          const newFiles = { ...prev };
          delete newFiles[documentId];
          return newFiles;
        });
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[documentId];
          return newProgress;
        });
        toast.success('فایل با موفقیت حذف شد')
      } else {
        toast.error(data.error || 'خطا در حذف فایل')
      }
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error('خطا در برقراری ارتباط با سرور')
    }
  }

  // Handle accordion state change
  const handleAccordionChange = (value: string[]) => {
    setOpenSections(value)
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

  // Add status alert if form is not editable
  const renderStatusAlert = () => {
    if (!isEditable && statusMessage) {
      return (
        <Alert className={`mb-4 ${taskStatus === "COMPLETED" ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>وضعیت درخواست</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">حساب کاربری</h1>
        <p className="text-muted-foreground">
          لطفاً اطلاعات خود را به طور کامل وارد نمایید
        </p>
      </div>

      <div className="bg-[#F6F6F6] rounded-2xl p-4 md:p-8 lg:p-12">
        {/* Stepper - show completed state when status is COMPLETED */}
        <Stepper steps={steps} currentStep={currentStep} />
        
        {/* Status alert */}
        <div className="mt-4">
        {renderStatusAlert()}
        </div>
        
        {/* Title and description now outside the Card */}
        <div className="mt-6 mb-4">
          <h2 className="text-xl font-bold">{steps[currentStep]}</h2>
          <p className="text-muted-foreground mt-1">
            {currentStep === 0 && "لطفاً اطلاعات و مدارک خواسته شده را با دقت وارد و بارگذاری نمایید"}
            {currentStep === 1 && "اطلاعات وارد شده را بررسی و تأیید نمایید"}
            {currentStep === 2 && "اطلاعات شما در حال بررسی توسط کارشناسان است"}
          </p>
        </div>

        <div>
          <div className="pt-6">
            {/* Step 1: Combined Information Entry and Document Upload */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <Accordion 
                  type="multiple" 
                  value={openSections} 
                  onValueChange={handleAccordionChange}
                  className="w-full"
                >
                  {/* اطلاعات اصلی (Main Information) */}
                  <AccordionItem value="section-1" className="border rounded-md bg-white p-4">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                          <Building className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">اطلاعات اصلی</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">نام شرکت</Label>
                          <Input
                            id="companyName"
                            placeholder="نام شرکت خود را وارد کنید"
                            value={formData.companyName}
                            onChange={(e) => updateFormData("companyName", e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="companyType">نوع شرکت</Label>
                            <Select
                              value={formData.companyType}
                              onValueChange={(value) => updateFormData("companyType", value)}
                              disabled={!isEditable}
                            >
                              <SelectTrigger id="companyType" className="w-full">
                                <SelectValue placeholder="نوع شرکت را انتخاب کنید" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="private">خصوصی</SelectItem>
                                <SelectItem value="public">دولتی</SelectItem>
                                <SelectItem value="semi-public">نیمه دولتی</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="establishmentDate">تاریخ تأسیس</Label>
                            <PersianDatePicker
                              id="establishmentDate"
                              value={formData.establishmentDate}
                              onChange={(date) => updateFormData("establishmentDate", date)}
                              placeholder="تاریخ تأسیس را انتخاب کنید"
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="registrationNumber">شماره ثبت</Label>
                            <Input
                              id="registrationNumber"
                              placeholder="شماره ثبت شرکت"
                              value={formData.registrationNumber}
                              onChange={(e) => updateFormData("registrationNumber", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="economicCode">کد اقتصادی</Label>
                            <Input
                              id="economicCode"
                              placeholder="کد اقتصادی شرکت"
                              value={formData.economicCode}
                              onChange={(e) => updateFormData("economicCode", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationalId">شناسه ملی شرکت</Label>
                          <Input
                            id="nationalId"
                            placeholder="شناسه ملی شرکت را وارد کنید"
                            value={formData.nationalId}
                            onChange={(e) => updateFormData("nationalId", e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* اطلاعات مدیر عامل (CEO Information) */}
                  <AccordionItem value="section-2" className="border rounded-md bg-white p-4 mt-3">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">اطلاعات مدیر عامل</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="ceoFirstName">نام</Label>
                            <Input
                              id="ceoFirstName"
                              placeholder="نام مدیر عامل"
                              value={formData.ceoFirstName}
                              onChange={(e) => updateFormData("ceoFirstName", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ceoLastName">نام خانوادگی</Label>
                            <Input
                              id="ceoLastName"
                              placeholder="نام خانوادگی مدیر عامل"
                              value={formData.ceoLastName}
                              onChange={(e) => updateFormData("ceoLastName", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="ceoNationalId">کد ملی</Label>
                            <Input
                              id="ceoNationalId"
                              placeholder="کد ملی مدیر عامل"
                              value={formData.ceoNationalId}
                              onChange={(e) => updateFormData("ceoNationalId", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ceoBirthDate">تاریخ تولد</Label>
                            <PersianDatePicker
                              id="ceoBirthDate"
                              value={formData.ceoBirthDate}
                              onChange={(date) => updateFormData("ceoBirthDate", date)}
                              placeholder="تاریخ تولد را انتخاب کنید"
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="ceoMobile">شماره موبایل</Label>
                            <Input
                              id="ceoMobile"
                              placeholder="شماره موبایل مدیر عامل"
                              value={formData.ceoMobile}
                              onChange={(e) => updateFormData("ceoMobile", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ceoPosition">سمت</Label>
                            <Input
                              id="ceoPosition"
                              placeholder="سمت مدیر عامل"
                              value={formData.ceoPosition}
                              onChange={(e) => updateFormData("ceoPosition", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* اطلاعات تماس (Contact Information) */}
                  <AccordionItem value="section-3" className="border rounded-md bg-white p-4 mt-3">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">اطلاعات تماس</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor="phone">شماره تلفن</Label>
                            <Input
                              id="phone"
                              placeholder="شماره تلفن ثابت"
                              value={formData.phone}
                              onChange={(e) => updateFormData("phone", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fax">شماره فکس</Label>
                            <Input
                              id="fax"
                              placeholder="شماره فکس"
                              value={formData.fax}
                              onChange={(e) => updateFormData("fax", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">ایمیل</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="آدرس ایمیل"
                              value={formData.email}
                              onChange={(e) => updateFormData("email", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="website">وب‌سایت</Label>
                            <Input
                              id="website"
                              placeholder="آدرس وب‌سایت"
                              value={formData.website}
                              onChange={(e) => updateFormData("website", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">کد پستی</Label>
                            <Input
                              id="postalCode"
                              placeholder="کد پستی ۱۰ رقمی"
                              value={formData.postalCode}
                              onChange={(e) => updateFormData("postalCode", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">آدرس</Label>
                          <Textarea
                            id="address"
                            placeholder="آدرس کامل را وارد کنید"
                            value={formData.address}
                            onChange={(e) => updateFormData("address", e.target.value)}
                            rows={3}
                            disabled={!isEditable}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* اطلاعات بانکی (Banking Information) */}
                  <AccordionItem value="section-4" className="border rounded-md bg-white p-4 mt-3">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">اطلاعات بانکی</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="bankName">نام بانک</Label>
                            <Input
                              id="bankName"
                              placeholder="نام بانک"
                              value={formData.bankName}
                              onChange={(e) => updateFormData("bankName", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="branchName">نام شعبه</Label>
                            <Input
                              id="branchName"
                              placeholder="نام شعبه"
                              value={formData.branchName}
                              onChange={(e) => updateFormData("branchName", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="branchCode">کد شعبه</Label>
                            <Input
                              id="branchCode"
                              placeholder="کد شعبه"
                              value={formData.branchCode}
                              onChange={(e) => updateFormData("branchCode", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accountNumber">شماره حساب</Label>
                            <Input
                              id="accountNumber"
                              placeholder="شماره حساب بانکی"
                              value={formData.accountNumber}
                              onChange={(e) => updateFormData("accountNumber", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ibanNumber">شماره شبا</Label>
                          <Input
                            id="ibanNumber"
                            placeholder="IR شماره شبا با فرمت"
                            value={formData.ibanNumber}
                            onChange={(e) => updateFormData("ibanNumber", e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* اطلاعات نماینده (Representative Information) */}
                  <AccordionItem value="section-5" className="border rounded-md bg-white p-4 mt-3">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                          <UserCog className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">اطلاعات نماینده</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="repFirstName">نام</Label>
                            <Input
                              id="repFirstName"
                              placeholder="نام نماینده"
                              value={formData.repFirstName}
                              onChange={(e) => updateFormData("repFirstName", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="repLastName">نام خانوادگی</Label>
                            <Input
                              id="repLastName"
                              placeholder="نام خانوادگی نماینده"
                              value={formData.repLastName}
                              onChange={(e) => updateFormData("repLastName", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor="repNationalId">کد ملی</Label>
                            <Input
                              id="repNationalId"
                              placeholder="کد ملی نماینده"
                              value={formData.repNationalId}
                              onChange={(e) => updateFormData("repNationalId", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="repPhone">شماره تماس</Label>
                            <Input
                              id="repPhone"
                              placeholder="شماره تماس نماینده"
                              value={formData.repPhone}
                              onChange={(e) => updateFormData("repPhone", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="repPosition">سمت</Label>
                            <Input
                              id="repPosition"
                              placeholder="سمت نماینده"
                              value={formData.repPosition}
                              onChange={(e) => updateFormData("repPosition", e.target.value)}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="repEmail">ایمیل</Label>
                          <Input
                            id="repEmail"
                            type="email"
                            placeholder="آدرس ایمیل نماینده"
                            value={formData.repEmail}
                            onChange={(e) => updateFormData("repEmail", e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Document Upload Section */}
                  <AccordionItem value="section-6" className="border rounded-md bg-white p-4 mt-3">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">مدارک مورد نیاز</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground">
                          لطفاً تمامی مدارک خواسته شده را با فرمت PDF یا JPG بارگذاری نمایید. حداکثر سایز هر فایل 5 مگابایت می‌باشد.
                        </p>
                        
                        <div className="grid gap-6 md:grid-cols-2">
                          {requiredDocuments.map((doc) => (
                            <div key={doc.id} className="space-y-3">
                              <div>
                                <Label className="font-medium text-base">
                                  {doc.name}
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                              </div>
                              <FileUpload
                                id={`file-${doc.id}`}
                                onFileChange={(file) => handleFileChange(doc.id, file)}
                                accept=".pdf,.jpg,.jpeg,.png"
                                disabled={!isEditable}
                                maxSize={5}
                                file={uploadedFiles[doc.id]}
                                uploadProgress={uploadProgress[doc.id]}
                                onUpload={() => uploadFile(doc.id)}
                                onDelete={() => deleteFile(doc.id)}
                              />
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="mr-3">
                              <h3 className="text-sm font-medium text-blue-800">توجه</h3>
                              <div className="mt-1 text-sm text-blue-700">
                                <p>تمامی مدارک باید خوانا و واضح باشند. در صورت نیاز به ارائه مدارک تکمیلی، پس از بررسی اولیه به شما اطلاع داده خواهد شد.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="text-sm text-slate-500 mt-6">
                  <p>برای تکمیل فرم، لطفاً تمامی بخش‌ها را باز کرده و اطلاعات خواسته شده را تکمیل نمایید.</p>
                </div>
              </div>
            )}

            {/* Step 2: Review and Submit (formerly step 3) */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* اطلاعات اصلی */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">اطلاعات اصلی</h3>
                    <dl className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">نام شرکت:</dt>
                        <dd className="font-medium">{formData.companyName || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">نوع شرکت:</dt>
                        <dd className="font-medium">{
                          formData.companyType === "private" ? "خصوصی" : 
                          formData.companyType === "public" ? "دولتی" : 
                          formData.companyType === "semi-public" ? "نیمه دولتی" : "-"
                        }</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">شماره ثبت:</dt>
                        <dd className="font-medium">{formData.registrationNumber || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">کد اقتصادی:</dt>
                        <dd className="font-medium">{formData.economicCode || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">شناسه ملی:</dt>
                        <dd className="font-medium">{formData.nationalId || "-"}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* اطلاعات مدیر عامل */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">اطلاعات مدیر عامل</h3>
                    <dl className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">نام و نام خانوادگی:</dt>
                        <dd className="font-medium">
                          {formData.ceoFirstName || formData.ceoLastName ? 
                            `${formData.ceoFirstName || ""} ${formData.ceoLastName || ""}`.trim() : "-"
                          }
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">کد ملی:</dt>
                        <dd className="font-medium">{formData.ceoNationalId || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">سمت:</dt>
                        <dd className="font-medium">{formData.ceoPosition || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">شماره تماس:</dt>
                        <dd className="font-medium">{formData.ceoMobile || "-"}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* اطلاعات تماس */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">اطلاعات تماس</h3>
                    <dl className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">تلفن:</dt>
                        <dd className="font-medium">{formData.phone || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">فکس:</dt>
                        <dd className="font-medium">{formData.fax || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">ایمیل:</dt>
                        <dd className="font-medium">{formData.email || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">وب‌سایت:</dt>
                        <dd className="font-medium">{formData.website || "-"}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* اطلاعات بانکی */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">اطلاعات بانکی</h3>
                    <dl className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">نام بانک:</dt>
                        <dd className="font-medium">{formData.bankName || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">نام شعبه:</dt>
                        <dd className="font-medium">{formData.branchName || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">شماره حساب:</dt>
                        <dd className="font-medium">{formData.accountNumber || "-"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">شماره شبا:</dt>
                        <dd className="font-medium">{formData.ibanNumber || "-"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">مدارک بارگذاری شده</h3>
                  {Object.keys(uploadedFiles).length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {Object.entries(uploadedFiles).map(([docId, file]) => {
                        if (!file) return null;
                        const doc = requiredDocuments.find(d => d.id === docId);
                        return (
                          <li key={docId} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{doc?.name}:</span>
                            <span className="font-medium">{file.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-amber-600">هیچ مدرکی بارگذاری نشده است.</p>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="mr-3">
                      <p className="text-sm text-amber-700">
                        با ثبت نهایی، اطلاعات شما جهت بررسی به کارشناسان ارسال خواهد شد و امکان ویرایش آن وجود نخواهد داشت.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Completed - only show when status is COMPLETED */}
            {currentStep === 3 && taskStatus === 'COMPLETED' && (
              <div className="space-y-6 text-center">
                <div className="py-8">
                  <div className="mb-4 flex justify-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                      <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900">
                    اطلاعات شما با موفقیت تایید شد
                  </h3>
                  
                  <p className="mt-4 text-base text-gray-600">
                    حساب کاربری شما فعال شده است و می‌توانید از تمامی امکانات سامانه استفاده نمایید.
                  </p>
                  
                  <div className="mt-8 flex justify-center gap-3">
                    <Button
                      onClick={() => window.location.href = '/dashboard'}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      رفتن به داشبورد
                    </Button>
                    <TaskStatusDialog contractorId={301} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Under Review - show when PENDING or IN_PROGRESS */}
            {currentStep === 2 && (taskStatus === 'PENDING' || taskStatus === 'IN_PROGRESS' || taskStatus === null) && (
              <div className="space-y-6 text-center">
                <div className="py-8">
                  <div className="mb-4 flex justify-center">
                    <svg className="h-16 w-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-medium text-gray-900">
                    درخواست شما با موفقیت ثبت شد
                  </h3>
                  
                  <p className="mt-4 text-sm text-gray-500">
                    اطلاعات شما در حال بررسی توسط کارشناسان است. نتیجه بررسی از طریق ایمیل به اطلاع شما خواهد رسید.
                  </p>
                  
                  <div className="mt-6 flex justify-center gap-3">
                    <TaskStatusDialog contractorId={301} />
                    <Button
                      onClick={fetchTaskStatus}
                      variant="outline"
                    >
                      بررسی وضعیت
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Rejected - show when REJECTED */}
            {currentStep === 2 && taskStatus === 'REJECTED' && (
              <div className="space-y-6 text-center">
                <div className="py-8">
                  <div className="mb-4 flex justify-center">
                    <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-medium text-gray-900">
                    اطلاعات نیاز به اصلاح دارد
                  </h3>
                  
                  <p className="mt-4 text-sm text-gray-500">
                    لطفاً نظرات کارشناس را مطالعه و اطلاعات را اصلاح نمایید.
                  </p>
                  
                  <div className="mt-6 flex justify-center gap-3">
                    <TaskStatusDialog contractorId={301} />
                    <Button
                      onClick={() => {
                        setCurrentStep(0);
                        setIsEditable(true);
                      }}
                      variant="default"
                    >
                      ویرایش اطلاعات
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0 || currentStep >= 2 || !isEditable}
              >
                قبلی
              </Button>
              
              <div className="flex items-center gap-3">
                {/* Save Draft Button - Secondary */}
                {currentStep < 2 && isEditable && (
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSaving || isSubmitting || !isEditable}
                  >
                    {isSaving ? "در حال ذخیره..." : "ذخیره پیش‌نویس"}
                  </Button>
                )}

                {/* Submit/Next Button - Primary */}
                {currentStep === 1 ? (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || isSaving || !isEditable}
                  >
                    {isSubmitting ? "در حال ارسال..." : "ثبت نهایی و ارسال برای بررسی"}
                  </Button>
                ) : currentStep < 1 ? (
                  <Button onClick={handleNext} disabled={!isEditable}>بعدی</Button>
                ) : null}
              </div>
            </div>
          </div>
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
                تیم ما پس از ارزیابی مدارک ارسالی، در صورت واجد شرایط بودن، با شما تماس خواهد گرفت.
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
    </div>
  )
}