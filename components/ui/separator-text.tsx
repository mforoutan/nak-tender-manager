import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils"

function SeparatorText({
    className,
    children,
    ...props
}: {
    className?: string
    children?: React.ReactNode
}) {
    return (
        <div className={cn("flex items-center gap-4", className)} {...props}>
            <Separator className="flex-1" />
            <span>{children}</span>
            <Separator className="flex-1" />
        </div>
    );
}

export { SeparatorText };