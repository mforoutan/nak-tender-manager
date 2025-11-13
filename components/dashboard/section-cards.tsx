import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScanSearchIcon, StickerIcon, TrophyIcon } from "lucide-react"
import { toPersianNumbers } from "@/lib/utils"

export function SectionCards() {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-white *:data-[slot=card]:border-none *:data-[slot=card]:shadow-[0px 1px 2px 0px rgba(0, 0, 0, 0.05)] lg:px-6 lg:grid-cols-4">
      <Card className="@container/card col-span-2 lg:col-span-1 shadow-card-small">
        <CardHeader>
          <div className="w-fit bg-[#0088FF] text-white p-3 rounded-md">
            <ScanSearchIcon />
          </div>
          <CardTitle className="font-semibold">
            ارزیابی‌ها
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 text-2xl font-medium">
            {toPersianNumbers('0')}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card col-span-2 lg:col-span-1 shadow-card-small">
        <CardHeader>
          <div className="w-fit bg-[#FFB800] text-white p-3 rounded-md">
            <TrophyIcon />
          </div>
          <CardTitle className="font-semibold">
            معاملات برنده شده
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 text-2xl font-medium">
            {toPersianNumbers('0')}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card col-span-2 lg:col-span-1 shadow-card-small">
        <CardHeader>
          <div className="w-fit bg-[#FF00DD] text-white p-3 rounded-md">
            <StickerIcon />
          </div>
          <CardTitle className="font-semibold">
            قراردادها
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 text-2xl font-medium">
            {toPersianNumbers('0')}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
