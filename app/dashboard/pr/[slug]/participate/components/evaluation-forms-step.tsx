"use client"

import Link from "next/link"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ExternalLink, ChevronLeft, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EvaluationFormsStepProps {
  processId: string
  disabled?: boolean
  currentStep: number
  onStepChange: (step: number) => void
}

export function EvaluationFormsStep({ processId, disabled, currentStep, onStepChange }: EvaluationFormsStepProps) {
  const cardContent = (
    <Card className={`shadow-card-small ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md transition-shadow'}`}>
      <CardContent>
        {/* {disabled && (
          <Alert className="mb-4">
            <AlertDescription>
              برای تکمیل فرم‌های ارزیابی، ابتدا باید نسبت به خرید اسناد اقدام کنید
            </AlertDescription>
          </Alert>
        )} */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${disabled ? 'bg-gray-200' : 'bg-[#F6F6F6]'} rounded-full`}>
              {disabled ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <FileText className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-semibold">تکمیل فرم‌های ارزیابی</h3>
          </div>
          {!disabled && <ChevronLeft />}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-bold">مرحله دوم: تکمیل فرم‌های ارزیابی</h3>
      {disabled ? (
        cardContent
      ) : (
        <Link href={`./participate/evaluation-forms`}>
          {cardContent}
        </Link>
      )}
    </section>
  )
}
