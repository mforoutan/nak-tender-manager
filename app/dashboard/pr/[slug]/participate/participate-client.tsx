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
    const [isPurchased, setIsPurchased] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [documentData, setDocumentData] = useState<{ [key: string]: any }>({})

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
        toast.success("خرید اسناد با موفقیت انجام شد")
    }

    const handleDocumentChange = (docId: string, data: any) => {
        setDocumentData(prev => ({
            ...prev,
            [docId]: data
        }))
    }

    const handleSubmit = async () => {
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
            setShowSuccessDialog(true)
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

            <Stepper className="place-self-center" steps={steps} currentStep={0} />

            <section className="w-full space-y-4">
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

                {/* Dynamic Document Steps */}
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

                {/* Submit Request Step */}
                <SubmitRequestStep
                    stepNumber={requiredDocuments.length + 3}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    disabled={!isPurchased || isSubmitted}
                />

                {/* Expert Review Step */}
                <ExpertReviewStep
                    stepNumber={requiredDocuments.length + 4}
                    isSubmitted={isSubmitted}
                />
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
