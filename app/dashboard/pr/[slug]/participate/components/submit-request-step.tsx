"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SubmitRequestStepProps {
  stepNumber: number
  onSubmit: () => void
  isSubmitting: boolean
  disabled?: boolean
}

export function SubmitRequestStep({ 
  stepNumber,
  onSubmit, 
  isSubmitting,
  disabled 
}: SubmitRequestStepProps) {
  return (
    <section 
      className="border rounded-md bg-white p-4"
    >
      <div className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F6F6F6] rounded-full">
            <Send className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">ارسال درخواست</h3>
        </div>
      </div>
      <div className="px-4 py-3">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  با کلیک بر روی دکمه "ثبت و ارسال درخواست"، اطلاعات و مستندات شما جهت بررسی به کارشناس ارسال خواهد شد.
                  پس از ارسال، امکان ویرایش وجود نخواهد داشت.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={onSubmit}
                disabled={disabled || isSubmitting}
                size="lg"
                className="w-full"
              >
                {isSubmitting ? "در حال ارسال..." : "ثبت و ارسال درخواست"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
