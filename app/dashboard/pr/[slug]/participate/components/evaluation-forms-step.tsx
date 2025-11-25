"use client"

import Link from "next/link"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ExternalLink, ChevronLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EvaluationFormsStepProps {
  processId: string
  disabled?: boolean
}

export function EvaluationFormsStep({ processId, disabled }: EvaluationFormsStepProps) {
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-bold">مرحله اول: خرید اسناد مناقصه</h3>
      <Link href={`./evaluation-forms`}>
      <Card className="shadow-card-small">
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F6F6F6] rounded-full">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">تکمیل فرم‌های ارزیابی</h3>
            </div>
            <ChevronLeft />
          </div>
          {/* <div className="space-y-4">
            {disabled && (
              <Alert>
                <AlertDescription>
                  برای تکمیل فرم‌های ارزیابی، ابتدا باید نسبت به خرید اسناد اقدام کنید
                </AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-muted-foreground">
              لطفا فرم‌های ارزیابی کیفی و کمی را با دقت تکمیل کنید. این فرم‌ها جهت بررسی صلاحیت شرکت در مناقصه استفاده می‌شود.
            </p>

            <Button
              asChild
              disabled={disabled}
              size="lg"
              classparticipate/evaluationll"
            >
              <Link href={`./evaluation-forms`}>
                ورود به صفحه فرم‌های ارزیابی
                <ExternalLink className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div> */}
        </CardContent>
      </Card>
      </Link>
    </section>
  )
}
