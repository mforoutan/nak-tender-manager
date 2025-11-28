import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
    title: "راهنماى شركت در معامله | سامانه مناقصات و مزايدات ناك",
    description: "راهنماى شركت در معامله در سامانه مناقصات و مزايدات ناك",
}

export default function HelpPage() {
    const badgesInfo = [
        { title: 'در انتظار بررسى', description: 'مستندات شما در حال بررسى توسط ناك مى باشد.', color: 'bg-yellow-100 text-yellow-800' },
        { title: 'تكميل شده', description: 'مستندات شما با موفقيت بررسى و تاييد شده است.', color: 'bg-[#34C759]/20 text-[#34C759] hover:bg-[#34C759]/20 hover:text-[#34C759]' },
        { title: 'رد شده', description: 'مستندات شما بررسى شده و نياز به اصلاح دارد.', color: 'bg-red-100 text-red-800' },
    ];

    return (
        <div className="space-y-8 px-4 lg:px-6">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">راهنماى شركت در معامله</h1>
            </div>
            <div className="bg-[#F6F6F6] rounded-2xl p-4 md:p-8 lg:p-12 font-bold space-y-10">
                <p>
                    دراين مطلب مى خواهيم به بررسى روند تاييد مستندات و شركت در معامله بيردازيم. پيشنهاد مى كنيم قبل از شركت در معاملات حتما اين بخش را مطالعه بفرماييد.
                    همانطوركه مشاهده مي كنيد به محض ورود به اين سامانه، قادر خواهيد بود تا فهرستى از معاملات در حال اجرا و هم جنين نمايى از عملكرد كلى خود را در معاملات قبلى مشاهده بفرماييد. تمامى اطلاعيه هاى نقش اول كيفيت (ناك) نيز در اين قسمت نمايش داده مى شود.
                </p>

                <Card className="p-0">
                    <CardContent className="px-6 py-8">
                        <p className="mb-12">تعريف وضعيت ها در سامانه</p>
                        <p className="mb-8">
                            پس ازورود به سامانه، وضعيت در بالا سمت جبٍ سامانه، قابل مشاهده است در زير به توضيح هر يك از وضعيت هايى كه ممكن است مشاهده بفرماييد پرداخته شده است:
                        </p>
                        <div className="space-y-4">
                            {badgesInfo.map((badge) => (
                                <div key={badge.title} className={`flex gap-x-2`}>
                                    <Badge
                                        className={`w-28 flex justify-center rounded-md px-2 py-1 text-xs ${badge.color}`}
                                    >
                                        {badge.title}
                                    </Badge>
                                    <p>{badge.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="p-0">
                    <CardContent className="px-6 py-8">
                        <p>
                            در منوى سمت راست صفحه، فهرستى از عناوين مورد نياز شما، وجود دارد شامل داشبورد، حساب کاربری٬ معاملات. با كليك بر روى هر يك از اين كزينه ها در منو، مى توانيد وارد صفحه مرتبط بشوید.
                        </p>

                    </CardContent>
                </Card>
                <Card className="p-0">
                    <CardContent className="px-6 py-8">
                        <p>
                            روند تكميل ثبت نام
                            <br />
                            1) اكر با جنين بخشى همانند عكس زير در داشبورد مواجه شديد، به اين معناست كه اطلاعات شما جهت تاييد براى شركت در معامله كامل نيست. براى اين كار تنها كافى است روى هر يك از اطلاعات درخواست شده كليك نماييد تا وارد صفحه مرتبط به آن شده و اطلاعات درخواستى را تكميل بفرماييد. پس از تكميل اطلاعات، تنها كافى است بر روى دكمه "تكميل ثبت نام و ارسال جهت بررسى" كليك نماييد تا اطلاعات شما ارسال كردند.
                        </p>
                    </CardContent>
                </Card>
                
            </div>
        </div>
    )
}