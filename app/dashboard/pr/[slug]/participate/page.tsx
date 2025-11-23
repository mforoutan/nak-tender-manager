import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export const metadata = {
    title: "شرکت در مناقصه | ناک",
    description: "صفحه شرکت در مناقصه در سامانه ناک",
};

export default function ParticipatePRPage({ params }: { params: { slug: string } }) {
    return(
       <section className="space-y-12 px-4 lg:px-6  max-w-7xl">
            <div className="flex justify-between">

                <Breadcrumb className="text-base">
                    <BreadcrumbList className="items-center gap-x-1.5">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="font-medium">
                                داشبورد
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-xl">
                            |
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`../${params.slug}`} className="font-medium">
                                جزئیات فرآیند مناقصه
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-xl">
                            |
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-xl">
                                شرکت در مناقصه
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Button variant={`ghost`}>
                    <ArrowLeftIcon />
                </Button>
            </div>

            <div className="flex gap-x-8">
                
            </div>
        </section>
    );
}