import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface FinalConfirmationStepProps {
    onSubmit: () => void;
    onPrevious: () => void;
}

export function FinalConfirmationStep({
    onSubmit,
    onPrevious,
}: FinalConfirmationStepProps) {
    return (
        <>
            <CardHeader className="text-right">
                <CardTitle>انتخاب رمز ورود</CardTitle>
            </CardHeader>
            <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">مرحله انتخاب رمز ورود</p>
            </div>
            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onPrevious}>
                    مرحله قبل
                </Button>
                <Button onClick={onSubmit}>
                    ثبت نام
                </Button>
            </div>
        </>
    );
}
