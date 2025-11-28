
import { ChangePasswordForm } from "./change-password-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "تغییر رمز عبور | سامانه مناقصات و مزايدات ناك",
    description: "تغییر رمز عبور در سامانه مناقصات و مزايدات ناك",
}

async function changePasswordAction(formData: FormData) {
    "use server";
    
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    // Validate input
    if (!oldPassword || !newPassword) {
        return { success: false, error: "رمز عبور فعلی و جدید الزامی است" };
    }

    if (newPassword.length < 8) {
        return { success: false, error: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد" };
    }

    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieStore.toString(),
            },
            body: JSON.stringify({
                oldPassword,
                newPassword,
            }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return { success: true, message: result.message || "رمز عبور با موفقیت تغییر یافت" };
        } else {
            return { success: false, error: result.error || "خطا در تغییر رمز عبور" };
        }
    } catch (error) {
        console.error("Error changing password:", error);
        return { success: false, error: "خطا در تغییر رمز عبور" };
    }
}

export default async function SettingsPage() {
    const session = await getSession();
    
    if (!session?.contractorId) {
        redirect("/");
    }

    return (
        <div className="space-y-8 px-4 lg:px-6">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">تغییر رمز عبور</h1>
            </div>
            <div className="bg-[#F6F6F6] rounded-2xl p-4 md:p-8 lg:p-12">
                <ChangePasswordForm changePasswordAction={changePasswordAction} />
            </div>
        </div>
    )
}