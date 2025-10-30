import { Empty, EmptyTitle } from "./ui/empty";

function YourDeals() {
    return (
        <div className="px-6 space-y-6">
            <h3>
                معاملات شما
            </h3>
            <div className="bg-[#F6F6F6] rounded-lg px-9 py-7">
                <Empty className="border border-dashed bg-white shadow-sm">
                    <EmptyTitle className="text-muted-foreground text-sm">معامله‌ای یافت نشد</EmptyTitle>
                </Empty>
            </div>
        </div>
    );
}

export { YourDeals };