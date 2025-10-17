"use client"

import * as React from "react"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Stepper } from "@/components/ui/stepper"
import { toast } from "sonner"

const steps = ["تکمیل اطلاعات", "آپلود اسناد و مدارک", "ثبت و ارسال جهت بررسی", "بررسی توسط کارشناس"]

export default function ProfilePage() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [formData, setFormData] = React.useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    nationalId: "",
    birthDate: "",

    // Step 2: Company Info
    companyName: "",
    companyType: "",
    registrationNumber: "",
    economicCode: "",

    // Step 3: Contact Info
    phone: "",
    email: "",
    address: "",
    postalCode: "",
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/account/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/account/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(data.message)
        // Optional: Redirect after successful submission
        // setTimeout(() => {
        //   router.push('/dashboard')
        // }, 1500)
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
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">حساب کاربری</h1>
        <p className="text-muted-foreground">
          لطفاً اطلاعات خود را به طور کامل وارد نمایید
        </p>
      </div>


      <div className="bg-[#F6F6F6] rounded-2xl p-12">

        <Stepper steps={steps} currentStep={currentStep} />

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep]}</CardTitle>
            <CardDescription>
              {currentStep === 0 && "اطلاعات شخصی خود را وارد کنید"}
              {currentStep === 1 && "اطلاعات شرکت خود را وارد کنید"}
              {currentStep === 2 && "اطلاعات تماس خود را وارد کنید"}
              {currentStep === 3 && "اطلاعات وارد شده را بررسی کنید"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">نام</Label>
                    <Input
                      id="firstName"
                      placeholder="نام خود را وارد کنید"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">نام خانوادگی</Label>
                    <Input
                      id="lastName"
                      placeholder="نام خانوادگی خود را وارد کنید"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">کد ملی</Label>
                    <Input
                      id="nationalId"
                      placeholder="کد ملی خود را وارد کنید"
                      value={formData.nationalId}
                      onChange={(e) => updateFormData("nationalId", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">تاریخ تولد</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateFormData("birthDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">نام شرکت</Label>
                  <Input
                    id="companyName"
                    placeholder="نام شرکت خود را وارد کنید"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyType">نوع شرکت</Label>
                  <Select
                    value={formData.companyType}
                    onValueChange={(value) => updateFormData("companyType", value)}
                  >
                    <SelectTrigger id="companyType">
                      <SelectValue placeholder="نوع شرکت را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">خصوصی</SelectItem>
                      <SelectItem value="public">دولتی</SelectItem>
                      <SelectItem value="semi-public">نیمه دولتی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">شماره ثبت</Label>
                    <Input
                      id="registrationNumber"
                      placeholder="شماره ثبت شرکت"
                      value={formData.registrationNumber}
                      onChange={(e) => updateFormData("registrationNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="economicCode">کد اقتصادی</Label>
                    <Input
                      id="economicCode"
                      placeholder="کد اقتصادی شرکت"
                      value={formData.economicCode}
                      onChange={(e) => updateFormData("economicCode", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره تماس</Label>
                    <Input
                      id="phone"
                      placeholder="09123456789"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">آدرس</Label>
                  <Textarea
                    id="address"
                    placeholder="آدرس کامل خود را وارد کنید"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">کد پستی</Label>
                  <Input
                    id="postalCode"
                    placeholder="کد پستی ۱۰ رقمی"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData("postalCode", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">اطلاعات شخصی</h3>
                    <dl className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">نام و نام خانوادگی:</dt>
                        <dd className="font-medium">{formData.firstName} {formData.lastName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">کد ملی:</dt>
                        <dd className="font-medium">{formData.nationalId}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">تاریخ تولد:</dt>
                        <dd className="font-medium">{formData.birthDate}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">اطلاعات شرکت</h3>
                    <dl className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">نام شرکت:</dt>
                        <dd className="font-medium">{formData.companyName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">نوع شرکت:</dt>
                        <dd className="font-medium">{formData.companyType}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">شماره ثبت:</dt>
                        <dd className="font-medium">{formData.registrationNumber}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">کد اقتصادی:</dt>
                        <dd className="font-medium">{formData.economicCode}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">اطلاعات تماس</h3>
                    <dl className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">شماره تماس:</dt>
                        <dd className="font-medium">{formData.phone}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">ایمیل:</dt>
                        <dd className="font-medium">{formData.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">کد پستی:</dt>
                        <dd className="font-medium">{formData.postalCode}</dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="text-muted-foreground">آدرس:</dt>
                        <dd className="font-medium">{formData.address}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                قبلی
              </Button>
              
              <div className="flex items-center gap-3">
                {/* Save Draft Button - Secondary */}
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving || isSubmitting}
                >
                  {isSaving ? "در حال ذخیره..." : "ذخیره پیش‌نویس"}
                </Button>

                {/* Submit/Next Button - Primary */}
                {currentStep === steps.length - 1 ? (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || isSaving}
                  >
                    {isSubmitting ? "در حال ارسال..." : "ثبت نهایی و ارسال برای بررسی"}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>بعدی</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}