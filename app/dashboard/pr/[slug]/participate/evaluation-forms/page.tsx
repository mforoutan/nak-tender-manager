import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowLeftIcon, Upload } from "lucide-react";
import { Children, ReactElement } from "react";

interface EvaluationFormProps {
    title: string;
    children: React.ReactNode;
}

function EvaluationFormDescription({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

function EvaluationFormScoringBasis({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

function EvaluationFormUpload({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

function EvaluationForm({ title, children }: EvaluationFormProps) {
    const childrenArray = Children.toArray(children);

    const description = childrenArray.find(
        (child) => (child as ReactElement).type === EvaluationFormDescription
    );

    const scoringBasis = childrenArray.find(
        (child) => (child as ReactElement).type === EvaluationFormScoringBasis
    );

    const upload = childrenArray.find(
        (child) => (child as ReactElement).type === EvaluationFormUpload
    );

    return (
        <Card className="px-6 py-8 shadow-card-small overflow-hidden ">
            <CardHeader className="text-lg font-bold p-0">
                <h4>{title}</h4>
            </CardHeader>
            <CardContent className="p-0 rounded-md overflow-x-scroll">
                <div className="**:text-right  min-w-3xl">
                    <div className="bg-[#F3F3F3] rounded-md [&_tr]:border-b-0">
                        <div className="flex *:data-[slot=table-head]:basis-1/3 *:data-[slot=table-head]:flex-1 *:data-[slot=table-head]:px-4 *:data-[slot=table-head]:py-3.5 *:data-[slot=table-head]:text-sm *:data-[slot=table-head]:font-semibold *:data-[slot=table-head]:text-muted-foreground">
                            <p data-slot="table-head">شاخص</p>
                            <p data-slot="table-head">مبنای امتیاز</p>
                            <p data-slot="table-head">آپلود پروژه های انجام شده</p>
                        </div>
                    </div>
                    <div className="flex **:data-[slot=table-cell]:p-4 **:data-[slot=table-cell]:font-medium **:data-[slot=table-cell]:text-sm **:data-[slot=table-cell]:basis-1/3 **:data-[slot=table-cell]:flex-1">
                        <div data-slot="table-cell">{description}</div>
                        <div data-slot="table-cell">{scoringBasis}</div>
                        <div data-slot="table-cell">{upload}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

EvaluationForm.Description = EvaluationFormDescription;
EvaluationForm.ScoringBasis = EvaluationFormScoringBasis;
EvaluationForm.Upload = EvaluationFormUpload;

export const metadata = {
    title: "فرم ارزیابی کیفی | ناک",
    description: "صفحه فرم ارزیابی کیفی در سامانه ناک",
};

export default async function EvaluationFormsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return (
        <section className="space-y-12 px-4 lg:px-6 max-w-7xl">
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
                            <BreadcrumbLink href={`/dashboard/pr/${slug}`} className="font-medium">
                                جزئیات فرآیند مناقصه
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-xl">
                            |
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/dashboard/pr/${slug}/participate`} className="font-medium">
                                شرکت در مناقصه
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-xl">
                            |
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-xl">
                                فرم ارزیابی کیفی
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Button variant="ghost" asChild>
                    <a href={`/dashboard/pr/${slug}/participate`}>
                        <ArrowLeftIcon />
                    </a>
                </Button>
            </div>

            <Card className="bg-[#F6F6F6] border-0 rounded-md p-12">
                <CardContent className="p-0 space-y-8">
                    <h1 className="font-bold text-2xl">فرم ارزیابی کیفی</h1>
                    <EvaluationForm title="فرم ارزیابی کیفی - بخش فنی">
                        <EvaluationForm.Description>
                            تعداد و مبلغ قراردادهای انجام شده در ۲ سال گذشته (مرتبط با مشابه یا موضوع مناقصه) هر قرارداد تا ۳۰٪ مبلغ برآورد قرارداد (۱ امتیاز) هر قرارداد بالاتر ۷۰٪ مبلغ برآورد قرارداد (۲ امتیاز)
                        </EvaluationForm.Description>

                        <EvaluationForm.ScoringBasis>
                            داوطلبان محترم می بایست تاییدیه های اخذ شده در خصوص قراردادهای قبلی خود با این شرکت را ارائه نمایند.
                        </EvaluationForm.ScoringBasis>

                        <EvaluationForm.Upload>
                            <Button className="mb-2">
                                <Upload />
                                آپلود
                            </Button>
                            <div className="text-xs font-medium text-[#A1A1AA] space-y-0.5">
                                <p>حداكثر حجم بارگذارى: 500 مگابايت</p>
                                <p>فایل های مجاز: png, mp4, zip, rar, pdf, doc, docx</p>
                            </div>
                        </EvaluationForm.Upload>
                    </EvaluationForm>
                </CardContent>
                <CardFooter className="flex justify-end mt-6 p-0">
                    <Button variant={`outline`}>
                        ذخیره اطلاعات
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
}