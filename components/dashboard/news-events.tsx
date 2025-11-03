import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Empty, EmptyContent, EmptyTitle } from "../ui/empty";

function NewsEvents() {
    return (
        <div className="px-6 space-y-6">
            <h3>
                اخبار و رویدادها
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 h-96">
                <Card className="relative overflow-hidden rounded-lg bg-[url(/news-bg.png)] bg-cover bg-no-repeat bg-center py-13 px-7">
                    <div className="absolute inset-0 bg-linear-to-br from-[#FDB24A] to-[#EF4844]/90" />
                    <CardHeader className="z-10 p-0">
                        <CardTitle className="text-white text-3xl">
                            اخبار
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="z-10 p-0">
                        <div className="bg-white/75 rounded-xl  backdrop-blur-md text-black p-4 space-y-4">
                            <div className="text-sm">خبری یافت نشد</div>
                            <div>
                                ......
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden rounded-lg bg-black py-13 px-7">
                    <div style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(95, 108, 224, 0) 23.55%, rgba(95, 108, 224, 0) 23.56%, #FF4B00 65.87%, #0088FF 85.93%)" }} 
                    className="absolute size-[600px] -top-[25%] -left-[70%] blur-xl rounded-full" />
                    <CardHeader className="z-10 p-0">
                        <CardTitle className="text-white text-3xl">
                            رویدادها
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="z-10 p-0">
                        <div className="bg-white/75 rounded-xl  backdrop-blur-md text-black p-4 space-y-4">
                            <div className="text-sm">رویدادی یافت نشد</div>
                            <div>
                                ......
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export { NewsEvents };