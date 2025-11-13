"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, FileX } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RejectedStepProps {
    onEdit: () => void;
    rejectionReason?: string;
}

export function RejectedStep({ onEdit, rejectionReason }: RejectedStepProps) {
    return (
        <>
            <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="p-6 bg-red-100 rounded-full mb-6">
                        <FileX className="h-16 w-16 text-red-600" />
                    </div>

                    <h3 className="text-2xl font-bold text-center mb-3 text-red-600">
                        نیاز به اصلاح
                    </h3>

                    <p className="text-center text-muted-foreground max-w-md mb-6">
                        اطلاعات ارسالی شما توسط کارشناسان بررسی شد و نیاز به اصلاح دارد.
                    </p>

                    {rejectionReason && (
                        <Alert className="max-w-md w-full mb-6 bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                <strong>دلیل عدم تأیید:</strong>
                                <p className="mt-2">{rejectionReason}</p>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md w-full">
                        <p className="text-sm text-amber-800 text-center">
                            لطفاً اطلاعات را مطابق با توضیحات اصلاح کرده و مجدداً ارسال نمایید.
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center mt-6 p-0">
                <Button onClick={onEdit} size="lg">
                    اصلاح و ارسال مجدد
                </Button>
            </CardFooter>
        </>
    );
}
