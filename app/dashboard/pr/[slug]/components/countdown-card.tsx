import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CircleAlertIcon, HourglassIcon } from "lucide-react";
import { Countdown } from "./countdown";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export function CountdownCard({ targetDate, slug }: { targetDate: Date | string; slug: string }) {
    return (
        <Card className="flex-1 px-6 lg:px-8 py-8 bg-gradient-to-br from-15% from-logo-gradient-1 to-80% to-logo-gradient-2">
            <CardHeader className="p-0 mb-8">
                <p className="py-2.5 px-3 flex gap-2 lg:gap-5 justify-center font-bold text-white text-lg">
                    <HourglassIcon />
                    <span>تا پایان مهلت تحویل اسناد و شرکت در معامله</span>
                </p>
            </CardHeader>
            <CardContent className="mb-9">
                <Countdown targetDate={targetDate} />
            </CardContent>
            <CardFooter className="flex flex-col gap-12 items-center">
                <Button className="bg-white text-black hover:bg-white/90">
                    <Link href={`/dashboard/pr/${slug}/participate`}>
                        شرکت در معامله
                    </Link>
                </Button>
                <Alert className="border-0 bg-white/20 text-white text-sm font-bold">
                    <CircleAlertIcon style={{ width: 20, height: 20 }} />
                    <AlertDescription className="text-white">
                        با انتخاب دکمهٔ «شرکت در مناقصه»،لازم است ابتدا نسبت به خرید و دانلود اسناد اقدام کنید، سپس فرم‌های ارزیابی کیفی و کمی را تکمیل نمایید.
                    </AlertDescription>
                </Alert>

            </CardFooter>
        </Card>
    );
}