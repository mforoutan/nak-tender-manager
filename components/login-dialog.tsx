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

function LoginDialog({ buttonSize = "default" }: { buttonSize?: "sm" | "default" | "lg" }) {
    const [showPassword, setShowPassword] = useState(false);
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
                    <form className="space-y-4">
                        <FieldGroup>
                            <FieldSet className="gap-y-4">
                                <FieldGroup className="gap-y-1">
                                    <FieldLabel className="text-xs text-muted-foreground">ایمیل یا نام کاربری</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon className=" pr-3">
                                            <MailIcon className="text-black size-5" />
                                        </InputGroupAddon>
                                        <InputGroupInput type="text" />
                                    </InputGroup>
                                </FieldGroup>
                                <FieldGroup className="gap-y-1 mt-4">
                                    <FieldLabel className="text-xs text-muted-foreground">رمز عبور</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon className="pr-3">
                                            <UserIcon className="text-black size-5" />
                                        </InputGroupAddon>
                                        <InputGroupInput type={showPassword ? "text" : "password"} />
                                        <InputGroupAddon align={`inline-end`} className="pl-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="focus:outline-none"
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
                                <Button type="submit" className="w-full mt-2 bg-black hover:bg-black/90 font-semibold text-xl py-1">
                                    ورود
                                </Button>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </div>
                <DialogFooter>
                    <div className="w-full text-primary text-center space-y-6 mt-6">
                        <SeparatorText className="text-xs font-semibold">کاربر جدید هستید؟</SeparatorText>
                        <Button variant={`outline`} className="hover:text-primary w-full mt-2 font-semibold text-xl py-1">
                            ثبت نام
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    );
}

export { LoginDialog };