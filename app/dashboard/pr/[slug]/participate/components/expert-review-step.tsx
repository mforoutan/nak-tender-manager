"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExpertReviewStepProps {
  stepNumber: number
  isSubmitted: boolean
  reviewStatus?: 'pending' | 'approved' | 'rejected'
  reviewComment?: string
}

export function ExpertReviewStep({ 
  stepNumber,
  isSubmitted,
  reviewStatus = 'pending',
  reviewComment
}: ExpertReviewStepProps) {
  const getStatusBadge = () => {
    switch (reviewStatus) {
      case 'approved':
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            تایید شده
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-4 w-4 mr-1" />
            رد شده
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-4 w-4 mr-1" />
            در انتظار بررسی
          </Badge>
        )
    }
  }

  return (
    <section 
      className="border rounded-md bg-white p-4"
    >
      <div className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F6F6F6] rounded-full">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">ارزیابی توسط کارشناس</h3>
          </div>
          {isSubmitted && getStatusBadge()}
        </div>
      </div>
      <div className="px-4 py-3">
        <Card>
          <CardContent className="pt-6">
            {!isSubmitted ? (
              <Alert>
                <AlertDescription>
                  پس از ارسال درخواست، کارشناس نسبت به بررسی مستندات و اطلاعات شما اقدام خواهد کرد.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {reviewStatus === 'pending' && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertTitle>در انتظار بررسی</AlertTitle>
                    <AlertDescription>
                      درخواست شما با موفقیت ثبت شد و در حال حاضر در صف بررسی کارشناس قرار دارد.
                      نتیجه بررسی از طریق پنل کاربری به اطلاع شما خواهد رسید.
                    </AlertDescription>
                  </Alert>
                )}
                
                {reviewStatus === 'approved' && (
                  <Alert className="border-green-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-700">تایید شده</AlertTitle>
                    <AlertDescription className="text-green-600">
                      درخواست شما توسط کارشناس تایید شد. اکنون می‌توانید در مناقصه شرکت کنید.
                      {reviewComment && (
                        <div className="mt-2 p-3 bg-green-50 rounded-md text-sm">
                          <strong>توضیحات کارشناس:</strong>
                          <p className="mt-1">{reviewComment}</p>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {reviewStatus === 'rejected' && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>رد شده</AlertTitle>
                    <AlertDescription>
                      متاسفانه درخواست شما توسط کارشناس رد شد. لطفا نسبت به رفع نواقص اقدام کنید.
                      {reviewComment && (
                        <div className="mt-2 p-3 bg-red-50 rounded-md text-sm">
                          <strong>دلیل رد:</strong>
                          <p className="mt-1">{reviewComment}</p>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
