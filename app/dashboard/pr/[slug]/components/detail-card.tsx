import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDaysIcon, DollarSignIcon, HandshakeIcon } from "lucide-react";
import { formatCurrency, formatDate, toPersianNumbers } from "@/lib/utils";

export function DetailCard(detail:
    {
        type: string,
        publishedNumber: string,
        guaranteeAmount: number,
        documentFee: number,
        importantDates: Array<{ label: string, value: string }>
    }) {

    return (
        <Card className="shadow-card-small flex-1 px-6 py-7.5">
            <CardHeader className="p-0 gap-y-8">
                <Badge variant={`outline`} className="place-self-start text-[#F87171] border-[#F87171] bg-[#F87171]/10 rounded-full py-2 px-3">{detail.type}</Badge>

                <ul>
                    <li className="flex items-center gap-x-3">
                        <HandshakeIcon />
                        <div className="flex gap-x-2 items-center">
                            <span className="text-sm">شماره معامله:</span>
                            <Badge variant={`outline`} className="py-0.5 px-5 rounded-md border-border-default text-lg font-bold">{toPersianNumbers(detail.publishedNumber)}</Badge>
                        </div>
                    </li>
                    <li className="flex items-center gap-x-3">
                        <DollarSignIcon />
                        <div className="flex gap-x-2 items-center">
                            <span className="text-sm">مبلغ تضمین:</span>
                            <p className="text-lg font-bold">{formatCurrency(detail.guaranteeAmount)}&nbsp;تومان</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-x-3">
                        <DollarSignIcon />
                        <div className="flex gap-x-2 items-center">
                            <span className="text-sm">مبلغ فروش توزیع اسناد مناقصه عمومی:</span>
                            <p className="text-lg font-bold">{formatCurrency(detail.documentFee)}&nbsp;تومان</p>
                        </div>
                    </li>
                </ul>
            </CardHeader>
            <CardFooter className="p-4 bg-[#F6F6F6] rounded-md text-blue-500 flex flex-col items-start gap-y-6">
                <span className="font-bold text-base">تاریخ‌های مهم</span>
                <ul>
                    {detail.importantDates.map((date: { label: string, value: string }, index: number) => (
                        <li key={index} className="flex items-center gap-x-3 px-3">
                            <CalendarDaysIcon />
                            <div className="flex flex-col lg:flex-row gap-x-2 items-start lg:items-center">
                                <span className="text-sm">{date.label}:</span>
                                <p className="font-bold text-base">{formatDate(date.value)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardFooter>
        </Card>
    );
}