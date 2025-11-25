"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Stepper } from "@/components/ui/stepper"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Accordion } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { toPersianNumbers } from "@/lib/utils"
import {
    PurchaseDocumentsStep,
    EvaluationFormsStep,
    DocumentSubmissionStep,
    SubmitRequestStep,
    ExpertReviewStep,
} from "./components"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ParticipateClientProps {
    processId: string
    processType: string
    requiredDocuments: Array<{
        id: number
        docName: string
        submissionType: string
        isMandatory: boolean
    }>
}

export default function ParticipateClient({
    processId,
    processType,
    requiredDocuments,
}: ParticipateClientProps) {
    console.log('ParticipateClient props:', { processId, processType, requiredDocuments });

    const [currentStep, setCurrentStep] = useState(0)
    const [isPurchased, setIsPurchased] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [documentData, setDocumentData] = useState<{ [key: string]: any }>({})
    const [isEditable, setIsEditable] = useState(true)

    // Build dynamic steps based on required documents
    const buildSteps = () => {
        const baseSteps = [
            "خرید اسناد مناقصه",
            "تکمیل فرم‌های ارزیابی",
        ]

        // Add document steps
        const documentSteps = requiredDocuments.map(doc => doc.docName)


        const finalSteps = [
            "ارسال درخواست",
            "ارزیابی توسط کارشناس"
        ]

        return [...baseSteps, ...documentSteps, ...finalSteps]
    }

    const steps = buildSteps()

    const handlePurchaseComplete = () => {
        setIsPurchased(true)
        setCurrentStep(1)
        toast.success("خرید اسناد با موفقیت انجام شد")
    }

    const handleDocumentChange = (docId: string, data: any) => {
        if (!isEditable) {
            toast.error("امکان ویرایش اطلاعات وجود ندارد")
            return
        }
        setDocumentData(prev => ({
            ...prev,
            [docId]: data
        }))
    }

    const handleNext = () => {
        if (currentStep < steps.length - 1 && isEditable) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0 && isEditable) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleSaveDraft = async () => {
        if (!isEditable) {
            toast.error("امکان ویرایش اطلاعات وجود ندارد")
            return
        }
        
        setIsSaving(true)
        try {
            // TODO: Implement save draft API
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("پیش‌نویس ذخیره شد")
        } catch (error) {
            toast.error("خطا در ذخیره پیش‌نویس")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSubmit = async () => {
        if (!isEditable) {
            toast.error("امکان ارسال مجدد اطلاعات وجود ندارد")
            return
        }

        setIsSubmitting(true)

        try {
            // TODO: Implement submission logic
            // Check if all required fields are filled
            const missingRequired = requiredDocuments
                .filter(doc => doc.isMandatory)
                .some(doc => !documentData[doc.id.toString()])

            if (missingRequired) {
                toast.error("لطفا تمام فیلدهای الزامی را تکمیل کنید")
                setIsSubmitting(false)
                return
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            setIsSubmitted(true)
            setIsEditable(false)
            setShowSuccessDialog(true)
            setCurrentStep(steps.length - 1)
            toast.success("درخواست شما با موفقیت ارسال شد")
        } catch (error) {
            toast.error("خطا در ارسال درخواست")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8 bg-[#F6F6F6] rounded-md p-12">
            <div className="flex items-center gap-5">
                <h1 className="font-bold text-2xl">شرکت در  مناقصه تک مرحله ای عام خرید TAPE Backup </h1>
                {/* <Badge variant={`outline`} className="py-0.5 px-5 rounded-md border-border-default text-lg font-bold">{toPersianNumbers(processId)}</Badge> */}
                <Badge variant={`outline`} className="py-0.5 px-5 rounded-md border-border-default text-lg font-bold">{processId}</Badge>

            </div>

            <Stepper className="place-self-center" steps={steps} currentStep={currentStep} />

            <section className="w-full space-y-10">
                {/* Step 1: Purchase Documents */}
                <PurchaseDocumentsStep
                    isPurchased={isPurchased}
                    onPurchaseComplete={handlePurchaseComplete}
                    disabled={isSubmitted}
                />

                {/* Step 2: Evaluation Forms */}
                <EvaluationFormsStep
                    processId={processId}
                    disabled={!isPurchased || isSubmitted}
                />

                <section className="space-y-6">
                    <h3 className="text-lg font-bold">مرحله سوم: مستندات پاکت های الف٬ ب و ج</h3>
                    <Card className="shadow-card-small p-12">
                        <CardContent className="space-y-10">
                            {requiredDocuments.map((doc, index) => (
                                <DocumentSubmissionStep
                                    key={doc.id}
                                    stepNumber={index + 3}
                                    document={doc}
                                    data={documentData[doc.id.toString()]}
                                    onChange={(data: any) => handleDocumentChange(doc.id.toString(), data)}
                                    disabled={!isPurchased || isSubmitted}
                                />
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <CardFooter className="flex justify-between mt-6 p-0">
                    <Button
                        variant="outline"
                        // onClick={onSaveDraft}
                        disabled={!isEditable || isSaving}
                        className="bg-transparent font-semibold"
                    >
                        {isSaving ? "در حال ذخیره..." : "ذخیره پیش‌نویس"}
                    </Button>
                    <Button disabled={!isEditable}>
                        {isSubmitting ? "در حال ارسال..." : "ثبت و ارسال درخواست"}
                    </Button>
                </CardFooter>
            </section>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>درخواست با موفقیت ارسال شد</DialogTitle>
                        <DialogDescription>
                            درخواست شرکت در مناقصه شما با موفقیت ثبت و برای بررسی کارشناس ارسال شد.
                            نتیجه بررسی از طریق پنل کاربری به اطلاع شما خواهد رسید.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowSuccessDialog(false)}>
                            متوجه شدم
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
