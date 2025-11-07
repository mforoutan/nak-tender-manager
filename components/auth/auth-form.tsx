import Link from "next/link";
import { AuthTabs } from "./auth-tabs";
import { Button } from "@/components/ui/button";

function AuthForm() {
    return (
        <main className="pt-48 mx-auto max-w-5xl text-center">
                <AuthTabs />
                <Link href={`/`}> 
                    <Button variant={`outline`} className="bg-transparent font-semibold">بازگشت به صفحه اصلی</Button>
                </Link>
            </main>
    );
}

export default AuthForm;