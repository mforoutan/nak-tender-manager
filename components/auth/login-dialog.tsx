"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeClosedIcon, EyeIcon, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SeparatorText } from "@/components/ui/separator-text";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function LoginDialog({ buttonSize = "default" }: { buttonSize?: "sm" | "default" | "lg" }) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!username || !password) {
            toast.error("لطفا نام کاربری و رمز عبور را وارد کنید");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("ورود موفقیت‌آمیز بود");
                router.push("/dashboard");
            } else {
                toast.error(data.error || "خطا در ورود به سیستم");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("خطا در برقراری ارتباط با سرور");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={buttonSize} variant="default" className={`bg-white text-black hover:bg-white/90 shadow-lg`}>
                    ورود
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm p-12">
                <DialogHeader className="sm:text-center">
                    <DialogTitle>ورود به ناک</DialogTitle>
                </DialogHeader>
                <div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <FieldSet className="gap-y-4">
                                <FieldGroup className="gap-y-1">
                                    <FieldLabel className="text-xs text-muted-foreground">ایمیل یا نام کاربری</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon className=" pr-3">
                                            <MailIcon className="text-black size-5" />
                                        </InputGroupAddon>
                                        <InputGroupInput 
                                            type="text" 
                                            placeholder=""
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </InputGroup>
                                </FieldGroup>
                                <FieldGroup className="gap-y-1 mt-4">
                                    <FieldLabel className="text-xs text-muted-foreground">رمز عبور</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon className="pr-3">
                                            <UserIcon className="text-black size-5" />
                                        </InputGroupAddon>
                                        <InputGroupInput 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder=""
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <InputGroupAddon align={`inline-end`} className="pl-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="focus:outline-none"
                                                disabled={isLoading}
                                            >
                                                {showPassword ? (
                                                    <EyeClosedIcon className="text-black size-5" />
                                                ) : (
                                                    <EyeIcon className="text-black size-5" />
                                                )}
                                            </button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldDescription className="text-left">
                                        <Link href="#" className="text-sm no-underline text-primary">
                                            فراموشی رمز
                                        </Link>
                                    </FieldDescription>
                                </FieldGroup>
                            </FieldSet>
                            <FieldGroup>
                                <Button 
                                    type="submit" 
                                    className="w-full mt-2 bg-black hover:bg-black/90 font-semibold text-xl py-1"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "در حال ورود..." : "ورود"}
                                </Button>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </div>
                <DialogFooter>
                    <div className="w-full text-primary text-center space-y-6 mt-6">
                        <SeparatorText className="text-xs font-semibold">کاربر جدید هستید؟</SeparatorText>
                        <Link href="/auth" className="block w-full">
                            <Button variant={`outline`} className="hover:text-primary w-full mt-2 font-semibold text-xl py-1">
                                ثبت نام
                            </Button>
                        </Link>
                    </div>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    );
}

export { LoginDialog };