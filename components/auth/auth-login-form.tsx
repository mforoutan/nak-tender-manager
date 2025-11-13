"use client";

import { FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeClosedIcon, EyeIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SeparatorText } from "@/components/ui/separator-text";

interface AuthLoginFormProps {
    onSwitchToRegister?: () => void;
}

export function AuthLoginForm({ onSwitchToRegister }: AuthLoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLoginSubmit = async (e: React.FormEvent) => {
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
        <Card className="w-md p-12 shadow-auth-card" dir="rtl">
            <CardContent className="p-0">
                <CardHeader className="sm:text-center">
                    <CardTitle>ورود به ناک</CardTitle>
                </CardHeader>
                <div>
                    <form className="space-y-4" onSubmit={handleLoginSubmit}>
                        <FieldGroup>
                            <FieldSet className="gap-y-4">
                                <FieldGroup>
                                    <FieldLabel className="text-xs text-muted-foreground">شماره یا نام کاربری</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <PhoneIcon className="text-black size-5" />
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
                                <FieldGroup className="mt-4">
                                    <FieldLabel className="text-xs text-muted-foreground">رمز عبور</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <UserIcon className="text-black size-5" />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            type={showPassword ? "text" : "password"}
                                            placeholder=""
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <InputGroupAddon align={`inline-end`}>
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
                <CardFooter>
                    <div className="w-full text-primary text-center space-y-6 mt-6">
                        <SeparatorText className="text-xs font-semibold">کاربر جدید هستید؟</SeparatorText>
                        <Button 
                            variant={`outline`} 
                            className="hover:text-primary w-full mt-2 font-semibold text-xl py-1"
                            onClick={onSwitchToRegister}
                        >
                            ثبت نام
                        </Button>
                    </div>
                </CardFooter>
            </CardContent>
        </Card>
    );
}
