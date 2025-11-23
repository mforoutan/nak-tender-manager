"use client"

import Link from "next/link"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EvaluationFormsStepProps {
  processId: string
  disabled?: boolean
}

export function EvaluationFormsStep({ processId, disabled }: EvaluationFormsStepProps) {
  return (
    <section className="border rounded-md bg-white p-4">
      <div className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F6F6F6] rounded-full">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">تکمیل فرم‌های ارزیابی</h3>
        </div>
      </div>
      <div className="px-4 py-3">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
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
                className="w-full"
              >
                <Link href={`./evaluation-forms`}>
                  ورود به صفحه فرم‌های ارزیابی
                  <ExternalLink className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
