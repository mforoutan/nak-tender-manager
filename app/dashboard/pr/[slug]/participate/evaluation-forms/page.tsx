import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, Upload } from "lucide-react";
import { Children, ReactElement } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface EvaluationFormProps {
    title: string;
    children: React.ReactNode;
}

interface EvaluationCriterion {
    id: number;
    criteriaCode: string;
    criteriaTitle: string;
    criteriaDescription: string;
    displayOrder: number;
    indentLevel: number;
    inputType: string;
    isRequired: boolean;
    validationRules: any;
    predefinedOptions: any;
    allowCustomInput: boolean;
    helpText: string;
    evaluationGuide: string;
    response: any;
}

interface EvaluationTemplate {
    id: number;
    templateCode: string;
    templateName: string;
    templateDescription: string;
    evaluationType: string;
    evaluationTypeCode: string;
    totalMaxScore: number;
    displayOrder: number;
    guidelines: string;
    instructions: string;
    criteria: EvaluationCriterion[];
}

function EvaluationFormDescription({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

function EvaluationFormScoringBasis({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

interface EvaluationFormUploadProps {
    children?: React.ReactNode;
    files?: Array<{ name: string; type: string; size: string }>;
    onUpload?: () => void;
}

function EvaluationFormUpload({ children, files, onUpload }: EvaluationFormUploadProps) {
    if (files && files.length > 0) {
        return (
            <div className="space-y-3">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Image
                            src={file.type === 'pdf' ? '/icons/pdf.svg' : '/icons/zip.svg'}
                            alt={file.type}
                            width={24}
                            height={24}
                        />
                        <Badge variant="outline" className="w-fit py-0.5 px-5 rounded-md border-border-default text-sm font-medium">
                            {file.name}
                        </Badge>
                        <span className="font-extrabold text-xs text-muted-foreground">{file.size}</span>
                    </div>
                ))}
            </div>
        );
    }
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

// Fetch evaluation forms from API
async function getEvaluationForms(slug: string) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(
            `${baseUrl}/api/participate/evaluation-forms?publicationNumber=${slug}`,
            {
                headers: {
                    'Cookie': sessionCookie ? `session=${sessionCookie.value}` : '',
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            console.error("API error:", await response.text());
            return null;
        }

        const result = await response.json();
        
        if (!result.success) {
            return null;
        }

        return result.data;
    } catch (error) {
        console.error("Error fetching evaluation forms:", error);
        return null;
    }
}

export default async function EvaluationFormsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const evaluationData = await getEvaluationForms(slug);

    if (!evaluationData) {
        return (
            <section className="space-y-12 px-4 lg:px-6 max-w-7xl">
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">فرم های ارزیابی یافت نشد</p>
                </div>
            </section>
        );
    }
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
                                {evaluationData.processTitle || 'جزئیات فرآیند مناقصه'}
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
                    <div>
                        <h1 className="font-bold text-2xl">فرم های ارزیابی</h1>
                        <p className="text-sm text-muted-foreground">
                            لطفا فرم های زیر را با دقت تکمیل نمایید. تمامی فیلدهای الزامی باید پر شوند.
                        </p>
                    </div>

                    {evaluationData.templates.map((template: any) => (
                        <div key={template.id} className="space-y-8">
                            {/* <div className="border-b pb-2">
                                <h2 className="font-bold text-xl">{template.templateName}</h2>
                                {template.templateDescription && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {template.templateDescription}
                                    </p>
                                )}
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">
                                        {template.evaluationTypeName}
                                    </Badge>
                                    <Badge variant="secondary">
                                        حداکثر امتیاز: {template.totalMaxScore}
                                    </Badge>
                                </div>
                            </div> */}

                            {template.criteria.map((criterion: any) => (
                                <EvaluationForm key={criterion.id} title={criterion.criteriaTitle}>
                                    <EvaluationForm.Description>
                                        {criterion.criteriaDescription}
                                    </EvaluationForm.Description>

                                    <EvaluationForm.ScoringBasis>
                                        {criterion.helpText || criterion.evaluationGuide}
                                    </EvaluationForm.ScoringBasis>

                                    <EvaluationForm.Upload>
                                        <Button className="mb-2">
                                            <Upload />
                                            آپلود
                                        </Button>
                                        {criterion.validationRules && (() => {
                                            const rules = criterion.validationRules;
                                            return (
                                                <div className="text-xs font-medium text-[#A1A1AA] space-y-0.5">
                                                    {rules.maxSize && (
                                                        <p>حداکثر حجم بارگذاری: {Math.floor(rules.maxSize / 1048576)} مگابایت</p>
                                                    )}
                                                    {rules.allowedTypes && (
                                                        <p>فایل های مجاز: {rules.allowedTypes.join(', ')}</p>
                                                    )}
                                                    {rules.maxFiles && (
                                                        <p>حداکثر تعداد فایل: {rules.maxFiles}</p>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </EvaluationForm.Upload>
                                </EvaluationForm>
                            ))}
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex justify-end mt-6 p-0 gap-3">
                    <Button variant="outline" asChild>
                        <a href={`/dashboard/pr/${slug}/participate`}>
                            بازگشت
                        </a>
                    </Button>
                    <Button>
                        ذخیره اطلاعات
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
}