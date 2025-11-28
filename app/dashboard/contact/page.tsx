import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Printer } from "lucide-react";

export const metadata = {
    title: "تماس با ما | سامانه مناقصات و مزايدات ناك",
    description: "تماس با ما در سامانه مناقصات و مزايدات ناك",
}

export default function ContactPage() {
    const ContactInfo = [
        {
            icon: Phone,
            title: "تلفن",
            value: "02181717828"
        },
        {
            icon: Printer,
            title: "فکس",
            value: "02181717829"
        },
        {
            icon: Mail,
            title: "ایمیل",
            value: "info@nak-mci.ir"
        },
        {
            icon: MapPin,
            title: "آدرس",
            value: "تهران، ميدان ونك، خيابان ملاصدرا، خيابان پرديس، نبش كوچه زاينده رود، پلاک ٢"
        }
    ]

    return (
        <div className="space-y-8 px-4 lg:px-6">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">تماس با ما</h1>
            </div>
            <Card className="px-6 py-8 shadow-card-small">
                <CardContent className="p-0 space-y-5">
                    {ContactInfo.map((info) => (
                        <div key={info.title} className="flex items-center gap-2">
                            <info.icon className="w-6 h-6 ml-1" />
                            <h3 className="text-sm text-[#4B5563]">{info.title}:</h3>
                            <p className="font-semibold">{info.value}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}