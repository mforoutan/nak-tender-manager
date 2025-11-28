"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Download, CheckCircle2, CircleAlertIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

import { alertStyles } from "@/components/alert-styles"
import { toPersianNumbers } from "@/lib/utils"

interface PurchaseDocumentsStepProps {
    isPurchased: boolean
    onPurchaseComplete: () => void
    documentPrice: number
    disabled?: boolean
    currentStep: number
    onStepChange: (step: number) => void
}

export function PurchaseDocumentsStep({
    isPurchased,
    onPurchaseComplete,
    documentPrice,
    disabled,
    currentStep,
    onStepChange
}: PurchaseDocumentsStepProps) {
    const handlePayment = () => {
        // TODO: Redirect to payment gateway
        // For now, just mark as purchased
        onPurchaseComplete()
    }

    // Categorized tender documents
    const documentCategories = [
        {
            title: "اسناد مناقصه",
            documents: [
                { name: "اسناد مناقصه - فایل اصلی.pdf", type: "pdf", size: "2.5 MB" },
                { name: "فرم پیشنهاد قیمت.pdf", type: "pdf", size: "850 KB" },
            ]
        },
        {
            title: "شرایط پیمان",
            documents: [
                { name: "شرایط عمومی پیمان.pdf", type: "pdf", size: "1.8 MB" },
                { name: "شرایط خصوصی پیمان.pdf", type: "pdf", size: "1.2 MB" },
            ]
        },
        {
            title: "مدارک فنی",
            documents: [
                { name: "مشخصات فنی پروژه.zip", type: "zip", size: "5.2 MB" },
                { name: "نقشه‌های اجرایی.dwg", type: "dwg", size: "3.4 MB" },
            ]
        }
    ]

    const getFileIcon = (type: string) => {
        switch (type) {
            case "pdf":
                return "/icons/pdf.svg"
            case "zip":
                return "/icons/zip.svg"
            case "dwg":
                return "/icons/zip.svg" // Use zip icon for dwg files
            default:
                return "/icons/pdf.svg"
        }
    }

    return (
        <section className="space-y-6">
            <h3 className="text-lg font-bold">مرحله اول: خرید اسناد مناقصه</h3>
            <Card className="shadow-card-small">
                <CardContent className="pt-6">
                    {!isPurchased ? (
                        <div>
                            <Alert className={`${alertStyles.info.className} text-[#042EFF] bg-transparent border-0 mb-8`}>
                                {alertStyles.info.icon}
                                <AlertDescription className="text-[#042EFF]">
                                    برای دریافت اسناد مناقصه، لازم است ابتدا نسبت به خرید اسناد اقدام کنید.
                                </AlertDescription>
                            </Alert>
                            <Badge variant={`outline`} className="block w-fit mb-12 py-0.5 px-5 rounded-md border-border-default text-lg font-bold">
                                قيمت فروش اسناد:&nbsp;{toPersianNumbers(documentPrice.toLocaleString())} تومان
                            </Badge>
                            <Button
                                onClick={handlePayment}
                                disabled={disabled}
                                size="sm"
                                className="py-2.5 px-4 gap-2 text-sm font-medium"
                            >
                                پرداخت با استفاده از كارت هاى عضو شتاب
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-bold text-base mb-6">فايل های اسناد مناقصه عمومى</h3>
                            <div className="space-y-8 mb-8">
                                {documentCategories.map((category, categoryIndex) => (
                                    <div key={categoryIndex}>
                                        <h3 className="font-semibold text-sm text-foreground mb-4">
                                            {category.title}
                                        </h3>
                                        <div className="flex flex-col lg:flex-row flex-wrap gap-y-4">
                                            {category.documents.map((doc, docIndex) => (
                                                <div
                                                    key={docIndex}
                                                    className="flex items-center basis-1/2 gap-2 hover:bg-muted/50"
                                                >
                                                    <Image
                                                        src={getFileIcon(doc.type)}
                                                        alt={doc.type}
                                                        width={24}
                                                        height={24}
                                                    />
                                                    <Badge variant={`outline`} className="w-fit py-0.5 px-5 rounded-md border-border-default text-sm font-medium">
                                                        {doc.name}
                                                    </Badge>
                                                    <span className="font-extrabold text-xs text-muted-foreground">{doc.size}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between">
                                <Alert className={`${alertStyles.success.className} p-0 text-[#34C759] bg-transparent border-0 mb-8`}>
                                    {alertStyles.success.icon}
                                    <AlertDescription className="text-[#34C759]">
                                        پرداخت شما با موفقیت انجام شد. اسناد مناقصه هم‌اکنون برای دانلود در دسترس است.
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    size="sm"
                                    className="self-end lg:self-auto py-2.5 px-4 gap-2"
                                    onClick={() => currentStep === 0 && onStepChange(1)}
                                >
                                    <Download />
                                    دانلود اسناد
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}
