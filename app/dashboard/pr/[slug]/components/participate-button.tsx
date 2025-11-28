"use client"

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import Link from "next/link";
import { toast } from "sonner";

interface ParticipateButtonProps {
    slug: string;
}

export function ParticipateButton({ slug }: ParticipateButtonProps) {
    const { accountVerificationTask } = useSession();
    
    const isVerified = accountVerificationTask?.status === 'COMPLETED';
    const isDisabled = !isVerified;

    const handleClick = (e: React.MouseEvent) => {
        if (isDisabled) {
            e.preventDefault();
            toast.error('حساب کاربری شما هنوز تایید نشده است', {
                description: 'برای شرکت در معامله، ابتدا باید حساب کاربری خود را در بخش "حساب کاربری" تکمیل و تایید کنید.'
            });
        }
    };

    return (
        <Button 
            className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
            asChild={!isDisabled}
        >
            {isDisabled ? (
                <span onClick={handleClick}>شرکت در معامله</span>
            ) : (
                <Link href={`/dashboard/pr/${slug}/participate`}>
                    شرکت در معامله
                </Link>
            )}
        </Button>
    );
}
